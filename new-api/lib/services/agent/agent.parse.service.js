import _ from 'lodash';
import Moment from 'moment';
import {
    MODEL_AGENT,
    PARAM_DOCUMENT_AGENT_ID,
    PARAM_DOCUMENT_AGENT_MODEL,
    PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE,
    PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE,
    PARAM_DOCUMENT_RASA_RESULTS,
    PARAM_DOCUMENT_SESSION,
    PARAM_DOCUMENT_TIME_STAMP,
    PARAM_DOCUMENT_TOTAL_ELAPSED_TIME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, AgentModel, text, timezone, sessionId = null }) {

    const startTime = new Moment();
    const { redis } = this.server.app;
    const {
        agentService,
        keywordService,
        documentService
    } = await this.server.services();

    try {
        AgentModel = AgentModel || await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        const trainedCategories = await agentService.getTrainedCategories({ AgentModel });
        const {
            ducklingURL,
            rasaURL,
            spacyPretrainedEntities,
            ducklingDimension
        } = agent.settings;

        const rasaKeywords = _.compact(await agentService.parseRasaKeywords({ AgentModel, text, trainedCategories, rasaURL }));
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
        const maximumSayingScore = _(parsedSystemKeywords).map('action').map('confidence').compact().max();
        const maximumCategoryScore = _(parsedSystemKeywords).map('categoryScore').compact().max();
        return await documentService.create({
            data: {
                document: text,
                [PARAM_DOCUMENT_TIME_STAMP]: new Date().toISOString(),
                [PARAM_DOCUMENT_RASA_RESULTS]: _.orderBy(parsedSystemKeywords, 'categoryScore', 'desc'),
                [PARAM_DOCUMENT_MAXIMUM_SAYING_SCORE]: maximumSayingScore,
                [PARAM_DOCUMENT_TOTAL_ELAPSED_TIME]: duration,
                [PARAM_DOCUMENT_MAXIMUM_CATEGORY_SCORE]: maximumCategoryScore || null,
                [PARAM_DOCUMENT_AGENT_ID]: agent.id,
                [PARAM_DOCUMENT_AGENT_MODEL]: agent.model,
                [PARAM_DOCUMENT_SESSION]: sessionId
            }
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
