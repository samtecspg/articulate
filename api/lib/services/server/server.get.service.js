import RedisErrorHandler from '../../errors/redis.error-handler';
import { MODEL_SERVER } from '../../../util/constants';

module.exports = async function ({ returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const Model = await redis.factory(MODEL_SERVER);
        const serverId = await Model.findServerId();
        const ServerModel = await redis.factory(MODEL_SERVER, serverId);
        return returnModel ? ServerModel : ServerModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `model: ${MODEL_SERVER}` });
    }
};
