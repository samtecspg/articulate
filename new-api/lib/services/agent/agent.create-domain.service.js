import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        id,
        domainData,
        AgentModel = null,
        returnModel = false
    }
) {

    const { globalService, domainService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await domainService.create({ data: domainData, agent: AgentModel, returnModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
