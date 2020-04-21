import {
    MODEL_AGENT,
    PARAM_DOCUMENT_AGENT_ID,
    PARAM_DOCUMENT_AGENT_MODEL,
    PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE,
    PARAM_DOCUMENT_MAXIMUM_ACTION_SCORE,
    PARAM_DOCUMENT_RASA_RESULTS,
    PARAM_DOCUMENT_RECOGNIZED_ACTION,
    PARAM_DOCUMENT_SESSION,
    PARAM_DOCUMENT_TIME_STAMP,
    PARAM_DOCUMENT_TOTAL_ELAPSED_TIME,
    MODEL_ACTION,
    RASA_INTENT_SPLIT_SYMBOL,
    MODEL_KEYWORD,
    RASA_MODEL_MODIFIERS
} from '../../../util/constants';

import _ from 'lodash';
import Moment from 'moment';
import RedisErrorHandler from '../../errors/redis.error-handler';

const getAgentModifers = ({ agentKeywords }) => {

    const agentModifiers = _.flatten(_.map(agentKeywords, (keyword) => {

        return _.map(keyword.modifiers, (modifier) => {

            modifier.keyword = keyword.keywordName;
            return modifier;
        });
    }));
    return agentModifiers;
};

const getConfidence = (confidence) => {

    if (confidence) {
        try {
            return parseFloat(confidence.replace('@', ''));
        } catch (error) {
            throw new Error(`An error ocurred parsing the confidence with the value: ${confidence}. Error: ${error}`);
        }
    }
    else {
        return 1.0;
    }
};

const getKeywords = (structuredKeywords) => {

    if (structuredKeywords) {
        try {
            const parsedKeywords = JSON.parse(structuredKeywords);
            const keywords = [];
            Object.keys(parsedKeywords).forEach((keyword) => {

                const newKeyword = {
                    extractor: 'structured_text',
                    confidence: 1,
                    keyword,
                    value: {
                        value: parsedKeywords[keyword]
                    }
                };
                keywords.push(newKeyword);
            });
            return keywords;
        } catch (error) {
            throw new Error(`An error ocurred parsing the keywords in the structured text. Error: ${error}`);
        }
    }
    else {
        return [];
    }
};

const generateRasaFormat = ({ text, action, confidence, structuredKeywords, agent, trainedCategories, agentActions, agentKeywords }) => {

    const agentModifiers = getAgentModifers({ agentKeywords });
    const isModifier = agentModifiers.filter((agentModifer) => {

        return agentModifer.modifierName === action;
    }).length > 0;
    const categoryToUse = trainedCategories.filter((trainedCategory) => {

        if (isModifier) {
            if (trainedCategory.name.indexOf(`_${RASA_MODEL_MODIFIERS}`) > -1) {
                return true;
            }
        }
        else {
            if (trainedCategory.name === 'default') {
                return true;
            }
        }
    })[0];
    const confidenceResult = getConfidence(confidence);
    const keywords = getKeywords(structuredKeywords);
    const startCategoryTime = new Moment();
    let actionRanking;
    if (isModifier) {
        actionRanking = _.map(agentModifiers, (tempModifier) => {

            return {
                confidence: tempModifier.modifierName === action ? confidenceResult : 0,
                name: tempModifier.modifierName
            };
        });
        if (action.indexOf(RASA_INTENT_SPLIT_SYMBOL) > -1) {
            actionRanking.push({
                confidence: confidenceResult,
                name: action
            })
        }
    }
    else {
        actionRanking = _.map(agentActions, (tempAction) => {

            return {
                confidence: tempAction.actionName === action ? confidenceResult : 0,
                name: tempAction.actionName
            };
        });
        if (action.indexOf(RASA_INTENT_SPLIT_SYMBOL) > -1) {
            actionRanking.push({
                confidence: confidenceResult,
                name: action
            })
        }
    }
    actionRanking = _.orderBy(actionRanking, 'confidence', 'desc');
    const endCategoryTime = new Moment();
    const duration = Moment.duration(endCategoryTime.diff(startCategoryTime), 'ms').asMilliseconds();
    const rasa_results = [{
        category: categoryToUse.name,
        project: agent.agentName,
        model: 'structured_input',
        keywords,
        action: actionRanking[0],
        action_ranking: actionRanking,
        elapsed_time_ms: duration,
        categoryScore: 1
    }];
    const result = {
        document: text,
        [PARAM_DOCUMENT_TIME_STAMP]: new Date().toISOString(),
        [PARAM_DOCUMENT_RASA_RESULTS]: rasa_results,
        [PARAM_DOCUMENT_RECOGNIZED_ACTION]: rasa_results[0].action.name,
        [PARAM_DOCUMENT_MAXIMUM_ACTION_SCORE]: confidenceResult,
        [PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE]: 1,
        [PARAM_DOCUMENT_AGENT_ID]: agent.id,
        [PARAM_DOCUMENT_AGENT_MODEL]: agent.model,
    };
    return result;
};

module.exports = async function ({ id, AgentModel, text, timezone, sessionId = null, saveDocument = true }) {

    const startTime = new Moment();
    const { redis } = this.server.app;
    const {
        agentService,
        keywordService,
        documentService,
        globalService
    } = await this.server.services();
    const structuredTextRegex = /^[/]([^{@]+)(@[0-9.]+)?([{].+)?/;

    try {
        AgentModel = AgentModel || await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        const trainedCategories = await agentService.getTrainedCategories({ AgentModel });

        const regexParseResult = structuredTextRegex.exec(text);

        if (regexParseResult) {
            const agentKeywords = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_KEYWORD, returnModel: false });
            const agentActions = await globalService.loadAllLinked({ parentModel: AgentModel, model: MODEL_ACTION, returnModel: false });
            const action = regexParseResult[1];
            const confidence = regexParseResult[2];
            const structuredKeywords = regexParseResult[3];
            const rasaFormattedResponse = generateRasaFormat({ text, action, confidence, structuredKeywords, agent, trainedCategories, agentActions, agentKeywords });
            rasaFormattedResponse[PARAM_DOCUMENT_SESSION] = sessionId;
            const endTime = new Moment();
            const duration = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
            rasaFormattedResponse[PARAM_DOCUMENT_TOTAL_ELAPSED_TIME] = duration;
            return await documentService.create({
                data: rasaFormattedResponse
            });
        }
        else {
            const {
                ducklingURL,
                rasaURLs,
                spacyPretrainedEntities,
                ducklingDimension,
                rasaConcurrentRequests,
            } = agent.settings;

            const rasaKeywords = _.compact(await agentService.parseRasaKeywords({ AgentModel, text, trainedCategories, rasaURLs, rasaConcurrentRequests }));
            const ducklingKeywords = _.compact(await agentService.parseDucklingKeywords({ AgentModel, text, timezone, ducklingURL }));
            const regexKeywords = await agentService.parseRegexKeywords({ AgentModel, text });

            const parsedSystemKeywords = await keywordService.parseSystemKeywords({
                parseResult: {
                    rasa: rasaKeywords,
                    duckling: ducklingKeywords,
                    regex: regexKeywords
                },
                spacyPretrainedEntities,
                ducklingDimension
            });
            const endTime = new Moment();
            const duration = Moment.duration(endTime.diff(startTime), 'ms').asMilliseconds();
            const maximumActionScore = _(parsedSystemKeywords).map('action').map('confidence').compact().max();
            const maximumCategoryScore = _(parsedSystemKeywords).map('categoryScore').compact().max();

            const data = {
                document: text,
                [PARAM_DOCUMENT_TIME_STAMP]: new Date().toISOString(),
                [PARAM_DOCUMENT_RASA_RESULTS]: _.orderBy(parsedSystemKeywords, 'categoryScore', 'desc'),
                [PARAM_DOCUMENT_RECOGNIZED_ACTION]: _.orderBy(parsedSystemKeywords, 'categoryScore', 'desc')[0].action.name,
                [PARAM_DOCUMENT_MAXIMUM_ACTION_SCORE]: maximumActionScore,
                [PARAM_DOCUMENT_TOTAL_ELAPSED_TIME]: duration,
                [PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE]: maximumCategoryScore || null,
                [PARAM_DOCUMENT_AGENT_ID]: agent.id,
                [PARAM_DOCUMENT_AGENT_MODEL]: agent.model,
                [PARAM_DOCUMENT_SESSION]: sessionId
            }
            if (saveDocument) {
                return await documentService.create({
                    data
                });
            } else {
                return data;
            }
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
