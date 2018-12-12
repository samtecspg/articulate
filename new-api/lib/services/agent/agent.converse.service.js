import _ from 'lodash';
import {
    CSO_AGENT,
    CSO_CONTEXT,
    CSO_TIMEZONE_DEFAULT,
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_CATEGORY,
    PARAM_DOCUMENT_RASA_RESULTS
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, sessionId, text, timezone, additionalKeys = null }) {

    const { redis, handlebars } = this.server.app;
    const { agentService, contextService, globalService } = await this.server.services();

    //MARK: get all the keywords for all the categories
    const getKeywordsFromRasaResults = ({ rasaResults }) => {

        return _.flatMap(rasaResults, (category) => {

            category.keywords = _.map(category.keywords, (keyword) => {

                //MARK: assigns category name to keyword
                keyword.category = category.category;
                return keyword;
            });
            return category.keywords;
        });
    };

    //MARK: returns the category recognizer, or the only category or just list of keywords
    const getBestRasaResult = ({ rasaResults, categoryClassifierThreshold }) => {

        let rasaResult = {};

        const recognizedCategory = rasaResults[0];

        //MARK: if there is more than one category and this exceeds the agent.categoryClassifierThreshold then return it
        if (rasaResults.length > 0 && recognizedCategory.categoryScore > categoryClassifierThreshold) {
            rasaResult = recognizedCategory;
        }
        else {
            //MARK: if there is only one then return it
            if (rasaResults.length === 1) {
                rasaResult = recognizedCategory;
            }
            //MARK: if there is more than one then collect all keywords
            //MARK: but this will have a different structure?
            else {
                rasaResult.keywords = getKeywordsFromRasaResults({ rasaResults });
            }
        }

        return rasaResult;
    };

    //MARK: if there is an action, look for it in the agent actions, return the first one
    const getActionData = ({ rasaResult, agentActions }) => {

        //MARK: rasaResult comes from getBestRasaResult
        if (rasaResult.action) {

            return _.filter(agentActions, (agentAction) => {

                return agentAction.actionName === rasaResult.action.name;
            })[0];
        }
        return null;
    };

    //MARK: find and action from the agent object by name
    const getActionByName = ({ actionName, agentActions }) => {

        return _.filter(agentActions, (agentAction) => {

            return agentAction.actionName === actionName;
        })[0];
    };

    //MARK: find category from agent.categories by name
    const getCategoryByName = ({ agentCategories, categoryName }) => {

        return _.filter(agentCategories, (agentCategory) => {

            return agentCategory.categoryName === categoryName;
        })[0];
    };

    //MARK: look into all the context until you get one with slots
    const getLastContextWithValidSlots = ({ context, recognizedKeywords }) => {

        const recognizedKeywordsNames = _.map(recognizedKeywords, 'keyword');
        let keepGoing = true;
        let contextIndex = context.length - 1;
        let lastValidContext = null;
        while (keepGoing && contextIndex !== -1) {

            const contextSlots = context[contextIndex].slots ? Object.keys(context[contextIndex].slots) : [];
            const intersection = _.intersection(recognizedKeywordsNames, contextSlots);
            if (intersection.length > 0) {
                keepGoing = false;
                lastValidContext = _.cloneDeep(context[contextIndex]);
            }
            contextIndex--;
        }
        return lastValidContext;
    };

    const recognizedKeywordsArePartOfTheContext = ({ slots, recognizedKeywords }) => {

        let results = _.map(recognizedKeywords, (recognizedKeyword) => {

            return Object.keys(slots).indexOf(recognizedKeyword.keyword) > -1;
        });
        results = _.compact(results);
        return results.length > 0;
    };

    const response = async ({ conversationStateObject }) => {

        //MARK: Get the last frame context from the context array
        conversationStateObject.currentContext = _.last(conversationStateObject.context.frames);
        //MARK: CSO.parse ===true
        if (conversationStateObject.parse) {
            //MARK: get category recognizer, 1 category or list of keywords from all categories
            conversationStateObject.rasaResult = getBestRasaResult({ rasaResults: conversationStateObject.parse, categoryClassifierThreshold: conversationStateObject.agent.categoryClassifierThreshold });
            //MARK: if there is an action, look for it in the agent actions
            conversationStateObject.action = getActionData({ rasaResult: conversationStateObject.rasaResult, agentActions: conversationStateObject.agent.actions });
            //MARK: if there is an action but no responses call RespondFallback and persist context
            if (conversationStateObject.action && (!conversationStateObject.action.responses || conversationStateObject.action.responses.length === 0)) {
                await agentService.converseUpdateContextFrames({ id: conversationStateObject.context.id, frames: conversationStateObject.context.frames });
                return agentService.converseGenerateResponseFallback({ agent: conversationStateObject.agent });
            }
            //MARK: CSO.parse ===false
            //MARK: get category using rasaResult category name
            conversationStateObject.category = getCategoryByName({ agentCategories: conversationStateObject.agent.categories, categoryName: conversationStateObject.rasaResult.category });
            //MARK: if there is an action and a category, check if the action confidence y bigger than the category threshold === true
            if (conversationStateObject.action && conversationStateObject.category && conversationStateObject.rasaResult.action.confidence > conversationStateObject.category.actionThreshold) {
                //MARK: if the current context is empty or the current OR if the action name is the same as the current context action add a new frame with empty slots
                if (!conversationStateObject.currentContext || (conversationStateObject.rasaResult.action.name !== conversationStateObject.currentContext.action)) {
                    const frame = {
                        action: conversationStateObject.rasaResult.action.name,
                        slots: {}
                    };
                    conversationStateObject.context.frames.push(frame);
                    //MARK: get the last context, but it is the same that was pushed above?
                    conversationStateObject.currentContext = frame;
                }
                const actionResponse = await agentService.converseGenerateResponse({
                    agent: conversationStateObject.agent,
                    action: conversationStateObject.action,
                    context: conversationStateObject.context,
                    currentContext: conversationStateObject.currentContext,
                    rasaResult: conversationStateObject.rasaResult,
                    text: conversationStateObject.text
                });
                //TODO: agentService.converseGenerateResponse, this needs to be removed from there
                await agentService.converseUpdateContextFrames({ id: conversationStateObject.context.id, frames: conversationStateObject.context.frames });
                return actionResponse;
            }
            //MARK: if there is an action and a category, check if the action confidence y bigger than the category threshold === false
            //MARK: if there is NO action then use the rasaResult.keywords else get them from getKeywordsFromRasaResults
            //MARK: I think this line doesn't do much since we already called getKeywordsFromRasaResults before to get rasaResult, the only difference is that we are saving the entire rasaResult instead of just the keywords
            const recognizedKeywords = conversationStateObject.rasaResult.action ? getKeywordsFromRasaResults(conversationStateObject) : conversationStateObject.rasaResult.keywords;
            //MARK: conversationStateObject.currentContext === true
            if (conversationStateObject.currentContext) {
                //MARK: recognizedKeywords>0
                if (recognizedKeywords.length > 0) {
                    //MARK: if there are slots and the recognizedKeywords are part of the context == true
                    if (conversationStateObject.currentContext.slots && Object.keys(conversationStateObject.currentContext.slots).length > 0 && recognizedKeywordsArePartOfTheContext({ slots: conversationStateObject.currentContext.slots, recognizedKeywords })) {
                        //MARK: update action object from the action of the context
                        conversationStateObject.action = getActionByName({ actionName: conversationStateObject.currentContext.action, agentActions: conversationStateObject.agent.actions });
                        const actionResponse = agentService.converseGenerateResponse({
                            action: conversationStateObject.action,
                            context: conversationStateObject.context,
                            currentContext: conversationStateObject.currentContext,
                            rasaResult: conversationStateObject.rasaResult,
                            text: conversationStateObject.text,
                        });
                        //TODO: agentService.converseGenerateResponse, this needs to be removed from there
                        await agentService.converseUpdateContextFrames({ context: conversationStateObject.context });
                        return actionResponse;
                    }
                    //MARK: recognizedKeywords <= 0
                    //MARK: if there are no slots then we get the last one with valid slots, update teh context list and set the last context, then get the action used by that context
                    const lastValidContext = getLastContextWithValidSlots({ context: conversationStateObject.context, recognizedKeywords });
                    if (lastValidContext) {
                        conversationStateObject.context.push(lastValidContext);
                        conversationStateObject.currentContext = lastValidContext;
                        conversationStateObject.action = getActionByName({ actionName: conversationStateObject.currentContext.name, agentActions: conversationStateObject.agent.actions });
                        const actionResponse = agentService.converseGenerateResponse({
                            action: conversationStateObject.action,
                            context: conversationStateObject.context,
                            currentContext: conversationStateObject.currentContext,
                            rasaResult: conversationStateObject.rasaResult,
                            text: conversationStateObject.text
                        });
                        //TODO: agentService.converseGenerateResponse, this needs to be removed from there
                        await agentService.converseUpdateContextFrames({ context: conversationStateObject.context });
                        return actionResponse;
                    }
                }
            }
            return agentService.converseGenerateResponseFallback({ agent: conversationStateObject.agent });
        }
        return Promise.reject(GlobalDefaultError({
            message: `Sorry, the engine wasn't able to parse your text`
        }));
    };

    const storeDataInQueue = ({ conversationStateObject, action, response }) => {
        
        conversationStateObject.context.actionQueue.push({
            action, 
            slots: conversationStateObject.currentContext.slots
        });
        conversationStateObject.context.responseQueue.push({ ...response });
    };

    const saveContextQueues = async ({ context }) => {
        await contextService.update({ 
            sessionId: context.sessionId, 
            data: {
                actionQueue: context.actionQueue,
                responseQueue: context.responseQueue
            }
        });
    }

    const removeFromQueue = async ({ conversationStateObject, action }) => {
        const index = indexOnQueue({ actionQueue: conversationStateObject.context.actionQueue, action });
        conversationStateObject.context.actionQueue.splice(index, 1);
        conversationStateObject.context.responseQueue.splice(index, 1);
        await contextService.update({ 
            sessionId: conversationStateObject.context.sessionId,
            data: {
                actionQueue: conversationStateObject.context.actionQueue,
                responseQueue: conversationStateObject.context.responseQueue
            }
        })
    }

    const moveOnQueue = ({ context, oldIndex, newIndex }) => {
        context.actionQueue.splice(newIndex, 0, context.actionQueue.splice(oldIndex, 1)[0]);
        context.responseQueue.splice(newIndex, 0, context.responseQueue.splice(oldIndex, 1)[0]);
    };

    const indexOnQueue = ({ actionQueue, action }) => {

        let actionIndex = -1;
        actionQueue.forEach((tempAction, tempIndex) => {

            if (tempAction.action === action){
                actionIndex = tempIndex;
            }
            return null;
        });

        return actionIndex;
    };

    const getResponsesFromQueue = async ({ context }) => {

        const responses = [];
        const actionsToRemove = [];
        context.responseQueue.every((response, index) => {

            if (response.actionWasFulfilled){
                responses.push(context.responseQueue[index].textResponse);
                actionsToRemove.push(index);
                return true;
            }
            else {
                if (index === 0){
                    responses.push(context.responseQueue[index].textResponse);
                }
                return false;
            }
        });
        context.actionQueue = _.filter(context.actionQueue, (action, index) => {
            return actionsToRemove.indexOf(index) === -1;
        });
        context.responseQueue = _.filter(context.responseQueue, (response, index) => {
            return actionsToRemove.indexOf(index) === -1;
        });
        return responses;
    };

    const conversationStateObject = {};

    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);

        //This block will handle sessionIds that doesn't exists
        //If the sessionId doesn't exists it creates one context for that session
        //And adds a frames attribute which is an empty array
        //The frames will be updated once converse resolve the value
        let context;
        try {
            context = await contextService.findBySession({ sessionId, loadFrames: true });
        }
        catch (error) {
            if (error.statusCode && error.statusCode === 404) {
                context = await contextService.create({ data: { sessionId } });
                context.frames = [];
            }
            else {
                return Promise.reject(error);
            }
        }
        const ParsedDocument = await agentService.parse({ AgentModel, text, timezone, returnModel: true });

        const recognizedActionNames = ParsedDocument[PARAM_DOCUMENT_RASA_RESULTS][0].action.name.split('+');

        conversationStateObject[CSO_CONTEXT] = context;
        conversationStateObject[CSO_AGENT] = AgentModel.allProperties();
        conversationStateObject[CSO_AGENT].actions = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel: false });
        conversationStateObject[CSO_AGENT].categories = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_CATEGORY, returnModel: false });

        let storeInQueue = false;
        let firstUnfulfilledAction = true;
        let currentQueueIndex = 0

        const responses = await recognizedActionNames.reduce(async (previousPromise, recognizedActionName) => {
            let finalResponse = null;
            const data = await previousPromise;
            const indexOfActionInQueue = indexOnQueue({ actionQueue: conversationStateObject.context.actionQueue, action: recognizedActionName });
            if (indexOfActionInQueue !== -1){
                moveOnQueue({
                    context: conversationStateObject.context,
                    oldIndex: indexOfActionInQueue,
                    newIndex: currentQueueIndex
                });
                currentQueueIndex++;
            }
            ParsedDocument[PARAM_DOCUMENT_RASA_RESULTS][0].action.name = recognizedActionName;
            conversationStateObject.docId = ParsedDocument.id;
            conversationStateObject.parse = ParsedDocument[PARAM_DOCUMENT_RASA_RESULTS];
            conversationStateObject.text = text;
            conversationStateObject.sessionId = sessionId;
            conversationStateObject.timezone = timezone || conversationStateObject[CSO_AGENT].timezone || CSO_TIMEZONE_DEFAULT;
            if (!_.isEmpty(additionalKeys)) {
                _.mapKeys(additionalKeys, (value, key) => {
    
                    if (!conversationStateObject[key]) {
                        conversationStateObject[key] = value;
                    }
                });
            }
    
            const agentToolResponse = await response({ conversationStateObject });
            storeInQueue = storeInQueue || !agentToolResponse.actionWasFulfilled;
                
            agentToolResponse.docId = conversationStateObject.docId;
            let postFormatPayloadToUse;
            let usedPostFormatAction;
            if (conversationStateObject.action && conversationStateObject.action.usePostFormat) {
                postFormatPayloadToUse = conversationStateObject.action.postFormat.postFormatPayload;
                usedPostFormatAction = true;
            }
            else if (conversationStateObject.agent.usePostFormat) {
                usedPostFormatAction = false;
                postFormatPayloadToUse = conversationStateObject.agent.postFormat.postFormatPayload;
            }
            if (postFormatPayloadToUse) {
                try {
                    const compiledPostFormat = handlebars.compile(postFormatPayloadToUse);
                    const processedPostFormat = compiledPostFormat({ ...conversationStateObject, ...{ textResponse: agentToolResponse.textResponse } });
                    const processedPostFormatJson = JSON.parse(processedPostFormat);
                    processedPostFormatJson.docId = agentToolResponse.docId;
                    if (!processedPostFormatJson.textResponse) {
                        processedPostFormatJson.textResponse = agentToolResponse.textResponse;
                    }
                    finalResponse = processedPostFormatJson;
                }
                catch (error) {
                    const errorMessage = usedPostFormatAction ? 'Error formatting the post response using action POST format : ' : 'Error formatting the post response using agent POST format : ';
                    console.log(errorMessage, error);
                    const responseWithError = { ...{ postFormatting: errorMessage + error }, agentToolResponse };
                    finalResponse = responseWithError;
                }    
            }
            else {
                finalResponse = agentToolResponse;
            }
            if (storeInQueue){
                await storeDataInQueue({ conversationStateObject, action: recognizedActionName, response: finalResponse });
                if (firstUnfulfilledAction){
                    data.push(finalResponse);
                    firstUnfulfilledAction = false;
                }
            }
            else {
                if (indexOfActionInQueue !== -1){
                    await removeFromQueue({ conversationStateObject, action: recognizedActionName  });
                }
                data.push(finalResponse);
            }
            return data;
        }, Promise.resolve([]));
        let textResponses = _.map(responses, 'textResponse');
        //extract responses from previous answers
        const responsesFromQueue = await getResponsesFromQueue({
            context: conversationStateObject.context
        });
        textResponses = textResponses.concat(responsesFromQueue);
        const textResponse = textResponses.join('. ');
        await saveContextQueues({ context: conversationStateObject.context });
        return {
            textResponse,
            docId: conversationStateObject.docId,
            responses
        }
    }
    catch (error) {

        throw RedisErrorHandler({ error });
    }
};
