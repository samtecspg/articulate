import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        id,
        AgentModel = null,
        keywordData,
        returnModel = false
    }
) {

    const { globalService, keywordService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await keywordService.create({ data: keywordData, agent: AgentModel, returnModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
