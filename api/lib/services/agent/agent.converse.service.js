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

//Reduce the remaining life of the saved slots
const updateLifespanOfSlots = ({ CSO }) => {
    Object.keys(CSO.context.savedSlots).forEach(slot => {
        const savedSlot = CSO.context.savedSlots[slot];
        if (savedSlot.remainingLife > -1){
            if (savedSlot.remainingLife > 0){
                //1 is the shortest value of life, after that it is set to null as 0 is infinity
                if (savedSlot.remainingLife === 1){
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
        if (!CSO.context.savedSlots[slot].remainingLife){
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


const getActionToModify = ({ recognizedModifier, CSO }) => {

    let actionToModify;

    /*
    * We are going to explore the whole action, looking for the actions that could be modified by the 
    * recognized mofifier. Here we do not discrimante between fulfilled or unfulfilled actions
    */
    const possibleModifiableActions = _.compact(CSO.context.actionQueue.map((action, actionIndex) => {

        const actionData = getActionData({ actionName: action.name, CSO });
        const isCandidate = actionData.slots.some((actionSlot) => {

            return actionSlot.keyword === recognizedModifier.keyword;
        });
        if (isCandidate){
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

module.exports = async function ({ id, sessionId, text, timezone, debug = false, additionalKeys = null }) {

    try {
        const { redis } = this.server.app;
        const { agentService, contextService, globalService } = await this.server.services();
    
        const CSO = {
            debug,
            text,
            sessionId,
            sendMessage: true,
            recognizedActions: [],
            recognizedModifiers: [],
            recognizedKeywords: [],
            processedWebhooks: [],
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
        
        const ParsedDocument = await agentService.parse({ AgentModel, text, timezone, returnModel: true, sessionId });
        CSO.docId = ParsedDocument.id;
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
    
        if (CSO.rasaResult.action && CSO.rasaResult.action.name){
            
            updateLifespanOfSlots({ CSO });
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
    
            //We extract the keywords from the best rasa result
            CSO.recognizedKeywords = await agentService.converseGetKeywordsFromRasaResults({ rasaResults: [ CSO.rasaResult ] })
    
            /*
            * Given that we don't have actions + modifiers models, we know that if there is a modifier, then we know that this is
            * what we need to process. Remember we don't support multi modifier models, but, we iterate as if we have it
            */
            if (CSO.recognizedModifiers.length > 0){
    
                for (const recognizedModifierName of CSO.recognizedModifiers){
                    if (CSO.context.actionQueue.length > 0){

                        const recognizedModifier = getModifierData({ recognizedModifierName, CSO });
                        CSO.actionToModify = getActionToModify({ recognizedModifier, CSO });
    
                        if (CSO.actionToModify && CSO.actionToModify.actionData.slots && CSO.actionToModify.actionData.slots.length > 0){
                            CSO.currentAction = CSO.context.actionQueue[CSO.actionToModify.index];
                            await agentService.converseFillActionSlots({ actionData: CSO.actionToModify.actionData, CSO, recognizedModifier });
                        }
                        else {
                            //Return fallback because this means user send a modifier for an action that doesn't exists in the queue
                            CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                            await agentService.converseSendResponseToUbiquity({ CSO });
                        }
                    }
                    else {
                        //Return fallback because this means user started the conversation with a modifier
                        CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
                        await agentService.converseSendResponseToUbiquity({ CSO });
                    }
                }
            }
    
            /*
            * We are going to concat the recognized actions to the action queue of the context.
            * If a modifier was recognized, then nothing will be concatenated as we don't recognize modifiers
            * and actions at the same time
            * The actions to concatenate are going to be inserted right before the oldest unfulfilled action
            * So we are going to generate the response for the new action and we will recover the unfulfilled action later
            */
            let newActionIndex = _.findIndex(CSO.context.actionQueue, (action) => {

                return !action.fulfilled;
            });
            newActionIndex = newActionIndex === -1 ? CSO.context.actionQueue.length : newActionIndex;

            CSO.recognizedActions.forEach((recognizedAction) => {
                CSO.context.actionQueue.splice(newActionIndex, 0, {
                    name: recognizedAction,
                    fulfilled: false
                });
                newActionIndex++;
            });
        
            /*
            * Once we have every action in the actionQueue, we are going to process that action queue to get responses
            */
            const unfulfilledActionsInQueue = CSO.context.actionQueue.some((action) => {

                return !action.fulfilled;
            });
            if (!unfulfilledActionsInQueue){
                if (CSO.recognizedModifiers.length > 0 && CSO.actionToModify){
                    CSO.context.actionQueue[CSO.actionToModify.index].fulfilled = false;
                }
            }
            CSO.actionIndex = 0;
            while(CSO.context.actionQueue[CSO.actionIndex] !== undefined){
                
                const action = CSO.context.actionQueue[CSO.actionIndex];
                if (!action.fulfilled){
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
                    ){
                        await agentService.converseFillActionSlots({ actionData, CSO });
                    }
    
                    if (CSO.sendMessage){

                        CSO.response = await agentService.converseGenerateResponse({ actionData, CSO });
                
                        //As the action wasn't fulfilled we are not going to send any more messages to the user
                        if (!CSO.response.fulfilled){
                            CSO.sendMessage = false
                        }
                        else {
                            CSO.currentAction.fulfilled = true;
            
                            //If there is any chained action
                            if (CSO.response.actions && CSO.response.actions.length > 0){
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
                        await agentService.converseSendResponseToUbiquity({ actionData, CSO });
                    }
                }
                CSO.actionIndex++;
            }
        }
        else {
            CSO.response = await agentService.converseGenerateResponseFallback({ CSO });
            await agentService.converseSendResponseToUbiquity({ CSO });
        }
        return CSO;
    }
    catch (error) {
        if (error.isParseError){
            if (error.missingCategories){
                return {
                    textResponse: 'I don\'t have any knowledge in my brain yet. Please teach me something.'
                }
            }
            if (error.missingTrainedCategories || error.missingTrainingAtAll){
                return {
                    textResponse: error.message
                }
            }
        }
        throw RedisErrorHandler({ error });
    }

};
