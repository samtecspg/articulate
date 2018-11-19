import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId }) {

    const { redis } = this.server.app;
    try {
        const Model = await redis.factory(MODEL_CONTEXT);
        await Model.findBySessionId({ sessionId });
        return await Model.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
