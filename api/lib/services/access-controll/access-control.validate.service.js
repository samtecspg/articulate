import { MODEL_ACCESS_POLICY } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const AccessPolicy = await redis.factory(MODEL_ACCESS_POLICY);
    try {
        await AccessPolicy.createInstance({ data });
        return returnModel ? AccessPolicy : AccessPolicy.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
