import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, direction, skip, limit, field, filter }) {

    const { globalService, trainingTestService } = await this.server.services();

    try {
        await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await trainingTestService.findByAgentId({ agentId: id, direction, skip, limit, field, filter });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
