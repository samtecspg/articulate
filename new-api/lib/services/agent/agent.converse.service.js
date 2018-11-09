import _ from 'lodash';
import {
    CSO_AGENT,
    CSO_CONTEXT,
    CSO_TIMEZONE_DEFAULT,
    MODEL_AGENT,
    PARAM_DOCUMENT_RASA_RESULTS
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, sessionId, text, timezone, additionalKeys = null }) {

    const { redis, handlebars } = this.server.app;
    const { agentService, contextService } = await this.server.services();

    //MARK: get all the keywords for all the domains
    const getKeywordsFromRasaResults = ({ rasaResults }) => {

        const keywords = _.flatMap(rasaResults, (domain) => {

            domain.keywords = _.map(domain.keywords, (keyword) => {

                //MARK: assigns domain name to keyword
                keyword.domain = domain.domain;
                return keyword;
            });
            return domain.keywords;
        });

        return keywords;
    };

    //MARK: returns the domain recognizer, or the only domain or just list of keywords
    const getBestRasaResult = ({ rasaResults, domainClassifierThreshold }) => {

        let rasaResult = {};

        const recognizedDomain = rasaResults[0];

        //MARK: if there is more than one domain and this exceeds the agent.domainClassifierThreshold then return it
        if (rasaResults.length > 0 && recognizedDomain.domainScore > domainClassifierThreshold) {
            rasaResult = recognizedDomain;
        }
        else {
            //MARK: if there is only one then return it
            if (rasaResults.length === 1) {
                rasaResult = recognizedDomain;
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

    //MARK: find domain from agent.domains by name
    const getDomainByName = ({ agentDomains, domainName }) => {

        return _.filter(agentDomains, (agentDomain) => {

            return agentDomain.domainName === domainName;
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
        conversationStateObject.currentContext = _.last(conversationStateObject);
        //MARK: CSO.parse ===true
        if (conversationStateObject.parse) {
            //MARK: get domain recognizer, 1 domain or list of keywords from all domains
            conversationStateObject.rasaResult = getBestRasaResult({ rasaResults: conversationStateObject.parse, domainClassifierThreshold: conversationStateObject.agent.domainClassifierThreshold });
            //MARK: if there is an action, look for it in the agent actions
            conversationStateObject.action = getActionData({ rasaResult: conversationStateObject.rasaResult });
            //MARK: if there is an action but no responses call RespondFallback and persist context
            if (conversationStateObject.action && (!conversationStateObject.action.responses || conversationStateObject.action.responses.length === 0)) {
                const actionResponse = agentService.converseGenerateResponse({
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
            //MARK: CSO.parse ===false
            //MARK: get domain using rasaResult domain name
            conversationStateObject.domain = getDomainByName({ agentDomains: conversationStateObject.agent.domains, domainName: conversationStateObject.rasaResult.domain });
            //MARK: if there is an action and a domain, check if the action confidence y bigger than the domain threshold === true
            if (conversationStateObject.action && conversationStateObject.domain && conversationStateObject.rasaResult.action.confidence > conversationStateObject.domain.actionThreshold) {
                //MARK: if the current context is empty or the current OR if the action name is the same as the current context action add a new frame with empty slots
                if (!conversationStateObject.currentContext || (conversationStateObject.rasaResult.action.name !== conversationStateObject.currentContext.action)) {
                    conversationStateObject.context.push({
                        action: conversationStateObject.rasaResult.action.name,
                        slots: {}
                    });
                    //MARK: get the last context, but it is the same that was pushed above?
                    conversationStateObject.currentContext = _.last(conversationStateObject);
                }
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
            //MARK: if there is an action and a domain, check if the action confidence y bigger than the domain threshold === false
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
                            text: conversationStateObject.text
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
    const conversationStateObject = {};
    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const context = contextService.findBySession({ sessionId, loadFrames: false });
        const ParsedDocument = await agentService.parse({ AgentModel, text, timezone, returnModel: true });

        conversationStateObject[CSO_CONTEXT] = context;
        conversationStateObject[CSO_AGENT] = AgentModel.allProperties();
        conversationStateObject.docId = ParsedDocument.id;
        conversationStateObject.parse = ParsedDocument.property(PARAM_DOCUMENT_RASA_RESULTS);
        conversationStateObject.text = text;
        conversationStateObject.sessionId = sessionId;
        conversationStateObject.timezone = timezone || conversationStateObject[CSO_AGENT].timezone || CSO_TIMEZONE_DEFAULT;
        if (additionalKeys) {
            _.mapKeys(additionalKeys, (value, key) => {

                if (!conversationStateObject[key]) {
                    conversationStateObject[key] = value;
                }
            });
        }

        const agentToolResponse = response({ conversationStateObject }); // comes from AgentTools.respond

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
                return processedPostFormatJson;
            }
            catch (error) {
                const errorMessage = usedPostFormatAction ? 'Error formatting the post response using action POST format : ' : 'Error formatting the post response using agent POST format : ';
                console.log(errorMessage, error);
                return { ...{ postFormatting: errorMessage + error }, agentToolResponse };
            }

        }
        else {
            return agentToolResponse;
        }
    }
    catch (error) {

        throw RedisErrorHandler({ error });
    }
};
