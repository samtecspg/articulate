import { MODEL_AGENT_VERSION } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, direction, skip, limit, field }) {

    const { globalService } = await this.server.services();
    let filter = {
        originalAgentVersionId: id
    }
    try {
        return await globalService.findAll({ skip, limit, direction, field, model: MODEL_AGENT_VERSION, filter });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
