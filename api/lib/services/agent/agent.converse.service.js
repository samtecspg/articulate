import _ from 'lodash';
import {
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_KEYWORD,
    PARAM_DOCUMENT_RASA_RESULTS,
    RASA_INTENT_SPLIT_SYMBOL,
    CSO_CATEGORIES,
    CSO_TIMEZONE_DEFAULT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import { Semaphore } from 'await-semaphore';
const { PerformanceObserver, performance } = require('perf_hooks');

var mainSemaphore = new Semaphore(1);
var semaphores = {};

//Reduce the remaining life of the saved slots
const updateLifespanOfSlots = ({ CSO }) => {
    Object.keys(CSO.context.savedSlots).forEach(slot => {
        const savedSlot = CSO.context.savedSlots[slot];
        if (savedSlot.remainingLife > -1) {
            if (savedSlot.remainingLife > 0) {
                //1 is the shortest value of life, after that it is set to null as 0 is infinity
                if (savedSlot.remainingLife === 1) {
                    savedSlot.remainingLife = null;
                }
                else {
                    savedSlot.remainingLife--;
                }
            }
        }
    });
    //Removes all the slots that doesn't have a remaining life
    Object.keys(CSO.context.savedSlots).forEach((slot) => {
        if (!CSO.context.savedSlots[slot].remainingLife) {
            delete CSO.context.savedSlots[slot];
        };
    });
};

const getAgentModifiers = ({ agentKeywords }) => {

    const agentModifiers = _.flatten(_.map(agentKeywords, (keyword) => {

        return _.map(keyword.modifiers, (modifier) => {

            modifier.keyword = keyword.keywordName;
            return modifier;
        });
    }));
    return agentModifiers;
};

const getActionData = ({ actionName, CSO }) => {

    return _.find(CSO.agent.actions, (agentAction) => {

        return agentAction.actionName === actionName;
    });
}


const getModifierData = ({ recognizedModifierName, CSO }) => {

    return _.find(CSO.agent.modifiers, (agentModifier) => {

        return agentModifier.modifierName === recognizedModifierName;
    });
}


const getActionToModify = ({ recognizedModifier, recognizedKeyword, CSO }) => {

    let actionToModify;

    /*
    * We are going to explore the whole action, looking for the actions that could be modified by the 
    * recognized mofifier. Here we do not discrimante between fulfilled or unfulfilled actions
    */
    const possibleModifiableActions = _.compact(CSO.context.actionQueue.map((action, actionIndex) => {

        const actionData = getActionData({ actionName: action.name, CSO });
        const isCandidate = actionData.slots.some((actionSlot) => {

            const keywordName = (recognizedModifier && recognizedModifier.keyword) ? recognizedModifier.keyword : recognizedKeyword.keyword;
            return actionSlot.keyword === keywordName;
        });
        if (isCandidate) {
            return {
                actionData,
                index: actionIndex,
                fulfilled: action.fulfilled
            }
        }
        return null;
    }));
    //We are going to return the oldest modifiable unfulfilled action
    const oldestModifiableUnfulfilledAction = _.find(possibleModifiableActions, (possibleModifiableAction) => { return !possibleModifiableAction.fulfilled });

    //In case all the actions in the queue are already fulfilled, we are going to modify the newest modifiable action
    actionToModify = oldestModifiableUnfulfilledAction ? oldestModifiableUnfulfilledAction : (possibleModifiableActions.length > 0 ? possibleModifiableActions[possibleModifiableActions.length - 1] : undefined);

    return actionToModify;
};

const forceUseWelcomeAction = CSO => {
    return CSO.welcomeActionOptions && CSO.welcomeActionOptions.forceUseWelcomeAction;
}

const welcomeActionNeeded = CSO => {
    return CSO.welcomeActionOptions && ((CSO.welcomeActionOptions.useWelcomeActionIfFirstMessage &&
        CSO.context.docIds.length === 0))
}

module.exports = async function ({ id, sessionId, text, timezone, debug = false, additionalKeys = null }) {

    var release = await mainSemaphore.acquire();
    if (!semaphores[sessionId]) {
        semaphores[sessionId] = new Semaphore(1);
    }
    release();

    release = await semaphores[sessionId].acquire();

    try {
        const { redis } = this.server.app;
        const { agentService, contextService, globalService, documentService } = await this.server.services();

        let CSO = {
            debug,
            text,
            sessionId,
            sendMessage: true,
            recognizedActions: [],
            recognizedModifiers: [],
            recognizedKeywords: [],
            processedWebhooks: {},
            processedResponses: []
        };

        const AgentModel = await redis.factory(MODEL_AGENT, id);
        CSO.agent = AgentModel.allProperties();
        CSO.agent.actions = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel: false });
        CSO.agent.keywords = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel: false });
        CSO.agent.modifiers = getAgentModifiers({ agentKeywords: CSO.agent.keywords });
        CSO.timezone = timezone || CSO.agent.timezone || CSO_TIMEZONE_DEFAULT;

        //We need to transform agent categories into a dir because response could use category params and this will help to get values
        const agentCategories = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_CATEGORY, returnModel: false });
        CSO[CSO_CATEGORIES] = {}
        agentCategories.forEach((agentCategory) => {

            CSO[CSO_CATEGORIES][agentCategory.categoryName] = agentCategory;
        });

        performance.mark('A');
        const ParsedDocument = await agentService.parse({ AgentModel, text, timezone, returnModel: true, sessionId });
        let documentUpdateData = {};
        performance.mark('B');
        performance.measure('agentService.parse', 'A', 'B');

        CSO.docId = ParsedDocument.id;
        CSO.indexId = ParsedDocument.index;
        CSO.parse = ParsedDocument[PARAM_DOCUMENT_RASA_RESULTS];

        CSO.context = await contextService.findOrCreateSession({ sessionId });

        CSO.rasaResult = await agentService.converseGetBestRasaResult({ CSO });

        if (!_.isEmpty(additionalKeys)) {
            _.mapKeys(additionalKeys, (value, key) => {

                if (!CSO[key]) {
                    CSO[key] = value;
                }
            });
        }

        //If the welcome action is forced (session just created) then no more processing is done
        //If the welcome action is needed (it's the first message of the user) then that message is also processed
        if (forceUseWelcomeAction(CSO) || welcomeActionNeeded(CSO)) {
            CSO.response = await agentService.converseGenerateResponseWelcome({ CSO });
            await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
        }

        if (!forceUseWelcomeAction(CSO)) {
            //We extract the keywords from the best rasa result
            CSO.recognizedKeywords = await agentService.converseGetKeywordsFromRasaResults({ rasaResults: [CSO.rasaResult] })

            if ((CSO.rasaResult.action && CSO.rasaResult.action.name) || CSO.recognizedKeywords.length > 0 || CSO.context.listenFreeText) {

                updateLifespanOfSlots({ CSO });

                var newActionIndex;
                if (!CSO.context.listenFreeText) {

                    /*
                    * This is the result action of RASA it could be a multiaction, a single action or a modifier
                    * We don't support action + modifiers recognition, we can just do single action, 
                    * multi action or single modifier recognition
                    */
                    const recognizedActionsNames = CSO.rasaResult.action.name.split(RASA_INTENT_SPLIT_SYMBOL);

                    //We extract from the rasa result the recognized actions names
                    CSO.recognizedActions = _.filter(recognizedActionsNames, (recognizedActionName) => {

                        return CSO.agent.actions.some((agentAction) => {

                            return agentAction.actionName === recognizedActionName;
                        });
                    });

                    /*
                    * We extract from the rasa result the recognized modifiers
                    * Currently we don't have a multimodifier recognition, but, this can support it
                    */
                    CSO.recognizedModifiers = _.filter(recognizedActionsNames, (recognizedActionName) => {

                        return CSO.agent.modifiers.some((agentModifier) => {

                            return agentModifier.modifierName === recognizedActionName;
                        });
                    });

                    /*
                    * Given that we don't have actions + modifiers models, we know that if there is a modifier, then we know that this is
                    * what we need to process. Remember we don't support multi modifier models, but, we iterate as if we have it
                    */
                    if (CSO.recognizedModifiers.length > 0) {

                        for (const recognizedModifierName of CSO.recognizedModifiers) {
                            if (CSO.context.actionQueue.length > 0) {

                                const recognizedModifier = getModifierData({ recognizedModifierName, CSO });
                                CSO.actionToModify = getActionToModify({ recognizedModifier, CSO });

                                if (CSO.actionToModify && CSO.actionToModify.actionData.slots && CSO.actionToModify.actionData.slots.length > 0) {
                                    CSO.currentAction = CSO.context.actionQueue[CSO.actionToModify.index];
                                    await agentService.converseFillActionSlots({ actionData: CSO.actionToModify.actionData, CSO, recognizedModifier });
                                }
                                else {
                                    //Return fallback because this means user send a modifier for an action that doesn't exists in the queue
                                    CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                                    await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
                                }
                            }
                            else {
                                //Return fallback because this means user started the conversation with a modifier
                                CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                                await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
                            }
                        }
                    }

                    /*
                    * This is known as the keyword flow 
                    * In case no modifiers neither actions were recognized we are going to use recognized keywords to try to fulfill
                    * an action in the queue that can be fulfilled with those recognized values
                    */
                    if (CSO.recognizedKeywords.length > 0 && CSO.recognizedModifiers.length === 0 && CSO.recognizedActions.length === 0) {
                        let noActionToModify = true;
                        if (CSO.context.actionQueue.length > 0) {
                            for (const recognizedKeyword of CSO.recognizedKeywords) {

                                CSO.actionToModify = getActionToModify({ recognizedKeyword, CSO });

                                if (CSO.actionToModify && CSO.actionToModify.actionData.slots && CSO.actionToModify.actionData.slots.length > 0) {
                                    noActionToModify = false;
                                    CSO.currentAction = CSO.context.actionQueue[CSO.actionToModify.index];
                                    CSO.currentAction.fulfilled = false;
                                    await agentService.converseFillActionSlots({ actionData: CSO.actionToModify.actionData, CSO });
                                }
                            }
                            if (noActionToModify) {
                                //Return fallback because this means a keyword was recognized for an action that doesn't exists in the queue
                                CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                                await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
                            }
                        }
                        else {
                            //Return fallback because this means user started the conversation with the keyword flow
                            CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                            await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
                        }
                    }

                    /*
                    * We are going to concat the recognized actions to the action queue of the context.
                    * If a modifier was recognized, then nothing will be concatenated as we don't recognize modifiers
                    * and actions at the same time
                    * The actions to concatenate are going to be inserted right before the oldest unfulfilled action
                    * So we are going to generate the response for the new action and we will recover the unfulfilled action later
                    */
                    newActionIndex = _.findIndex(CSO.context.actionQueue, (action) => {

                        return !action.fulfilled;
                    });
                    newActionIndex = newActionIndex === -1 ? CSO.context.actionQueue.length : newActionIndex;

                    for (var i = 0; i < CSO.recognizedActions.length; i++) {
                        var recognizedAction = CSO.recognizedActions[i];
                        CSO.context.actionQueue.splice(newActionIndex, 0, {
                            name: recognizedAction,
                            fulfilled: false
                        });

                        /*
                        * Sometimes when there are unfullfilled actions waiting for slots, if the use enters a slot value
                        * this value is recognized both as a keyword to fulfill the pending action but also as a whole new 
                        * identical action, resulting in two identical actions resolved. We are ignoring the most recent 
                        * action based on the following conditions:
                        *   - There must be no modifiers identified
                        *   - There must be at least one action and one keyword recognized
                        *   - There must be at least one unfulfilled action in the queue of the same type as the recognized action
                        *   - At least one of the empty required slots of the pending action should be filled with the recognized keywords
                        */
                        var mostRecentActionData;
                        mostRecentActionData = getActionData({ actionName: CSO.context.actionQueue[newActionIndex].name, CSO });
                        var mostRecentActionShouldBeIgnored = await agentService.converseMostRecentActionShoulBeIgnored({
                            actionData: mostRecentActionData,
                            CSO,
                            newActionIndex: newActionIndex,
                            getActionData
                        });

                        if (mostRecentActionShouldBeIgnored) {
                            CSO.context.actionQueue[newActionIndex].fulfilled = true;
                        }

                        newActionIndex++;
                    };
                }

                /*
                * Once we have every action in the actionQueue, we are going to process that action queue to get responses
                */
                const unfulfilledActionsInQueue = CSO.context.actionQueue.some((action) => {
                    return !action.fulfilled;
                });
                if (!unfulfilledActionsInQueue) {
                    if (CSO.recognizedModifiers.length > 0 && CSO.actionToModify) {
                        CSO.context.actionQueue[CSO.actionToModify.index].fulfilled = false;
                    }
                }
                CSO.actionIndex = 0;
                while (CSO.context.actionQueue[CSO.actionIndex] !== undefined) {

                    const action = CSO.context.actionQueue[CSO.actionIndex];
                    if (!action.fulfilled) {
                        const actionData = getActionData({ actionName: action.name, CSO });
                        CSO.currentAction = CSO.context.actionQueue[CSO.actionIndex];

                        /*
                        * We include CSO.recognizedModifiers.length === 0 to avoid duplicate filling if a modifier was recognized
                        * If in the future we enable action + modifier model we will need another strategy
                        */
                        if (actionData.slots &&
                            actionData.slots.length > 0 &&
                            (CSO.recognizedModifiers.length === 0 ||
                                (CSO.recognizedModifiers.length > 0 &&
                                    CSO.actionToModify &&
                                    CSO.actionToModify.actionData.actionName !== actionData.actionName)
                            )
                        ) {
                            await agentService.converseFillActionSlots({ actionData, CSO });
                        }

                        if (CSO.sendMessage) {

                            CSO.response = await agentService.converseGenerateResponse({ actionData, CSO });

                            if (CSO.response.slotPromptLimitReached) {
                                CSO.currentAction.fulfilled = true;
                            }
                            else {
                                //As the action wasn't fulfilled we are not going to send any more messages to the user
                                if (!CSO.response.fulfilled) {
                                    CSO.sendMessage = false
                                }
                                else {
                                    CSO.currentAction.fulfilled = true;

                                    //If there is any chained action
                                    if (CSO.response.actions && CSO.response.actions.length > 0) {
                                        let newActionIndex = CSO.actionIndex + 1;
                                        CSO.response.actions.forEach((chainedAction) => {

                                            CSO.context.actionQueue.splice(newActionIndex, 0, {
                                                name: chainedAction,
                                                fulfilled: false
                                            });
                                            newActionIndex++;
                                        });
                                    }
                                }
                                /*
                                * This would either send a response, a text promt or a fallback
                                * CSO.ubiquity could be filled by using the additionalKeys param
                                */
                                performance.mark('A');
                                await agentService.converseSendResponseToUbiquity({ actionData, CSO, ParsedDocument, documentUpdateData });
                                performance.mark('B');
                                performance.measure('agentService.converseSendResponseToUbiquity', 'A', 'B');
                            }
                        } else {
                            await contextService.update({
                                sessionId: CSO.context.sessionId,
                                data: {
                                    savedSlots: CSO.context.savedSlots,
                                    docIds: CSO.context.docIds,
                                    actionQueue: CSO.context.actionQueue,
                                    listenFreeText: CSO.context.listenFreeText ? true : false
                                }
                            });
                        }
                    }
                    CSO.actionIndex++;
                }
            }
            else {
                CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                await agentService.converseSendResponseToUbiquity({ CSO, ParsedDocument, documentUpdateData });
            }

            CSO.textResponse = CSO.processedResponses.map((processedResponse) => {

                return processedResponse.textResponse;
            }).join(' ');

            const converseResult = {
                textResponse: CSO.textResponse,
                docId: CSO.docId,
                indexId: CSO.indexId,
                responses: CSO.processedResponses
            };

            if (debug) {
                const { context, parse, currentAction, docId, indexId, webhooks } = CSO;
                converseResult.CSO = {
                    docId,
                    indexId,
                    parse,
                    currentAction,
                    context,
                    webhooks
                };
            }
            documentService.update({
                id: CSO.docId,
                indexId: CSO.indexId,
                data: {
                    converseResult: documentUpdateData.fullConverseResult
                }
            }).then(() => { })
                .catch(err => { throw err; });
            release();
            return converseResult;
        }
    }
    catch (error) {
        release();
        if (error.isParseError) {
            if (error.missingCategories) {
                return {
                    textResponse: 'I don\'t have any knowledge in my brain yet. Please teach me something.'
                }
            }
            if (error.missingTrainedCategories || error.missingTrainingAtAll) {
                return {
                    textResponse: error.message
                }
            }
        }
        throw RedisErrorHandler({ error });
    }
};