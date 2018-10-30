import _ from 'lodash';
import Moment from 'moment';
import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, text, timezone, returnModel = false }) {

    const startTime = new Moment();
    const { redis } = this.server.app;
    const {
        agentService,
        keywordService,
        documentService
    } = await this.server.services();

    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        const agent = AgentModel.allProperties();
        const trainedDomains = await agentService.getTrainedDomains({ AgentModel });
        const {
            ducklingURL,
            rasaURL,
            spacyPretrainedEntities,
            ducklingDimension
        } = agent.settings;

        const rasaKeywords = await agentService.parseRasaKeywords({ AgentModel, text, trainedDomains, rasaURL });
        const ducklingKeywords = await agentService.parseDucklingKeywords({ AgentModel, text, timezone, ducklingURL });
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
        const duration = Moment.duration(endTime.diff(startTime).asMilliseconds());
        const maximumSayingScore = _.max(_.compact(_.map(_.map(parsedSystemKeywords, 'action'), 'confidence')));
        const maximumDomainScore = _.max(_.compact(_.map(parsedSystemKeywords, 'domainScore')));
        return await documentService.create({
            document: text,
            timeStamp: new Date().toISOString(),
            rasaResults: _.orderBy(parsedSystemKeywords, 'domainScore', 'desc'),
            maximumSayingScore,
            totalElapsedTimeMS: duration,
            maximumDomainScore: maximumDomainScore || null,
            returnModel
        });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
