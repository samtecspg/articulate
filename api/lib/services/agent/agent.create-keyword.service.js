import { MODEL_AGENT, MODEL_KEYWORD } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import GlobalDefaultError from '../../errors/global.default-error';

module.exports = async function (
    {
        id,
        AgentModel = null,
        keywordData,
        returnModel = false
    }
) {

    const { globalService, keywordService, agentService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const isUnique = await agentService.isModelUnique({
            AgentModel,
            model: MODEL_KEYWORD,
            field: 'keywordName',
            value: keywordData.keywordName
        });
        if (isUnique) {
            return await keywordService.create({ data: keywordData, agent: AgentModel, returnModel });
        }
        return Promise.reject(GlobalDefaultError({
            message: `The ${MODEL_AGENT} already has a ${MODEL_KEYWORD} with the name= "${keywordData.keywordName}"`,
            statusCode: 400
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
