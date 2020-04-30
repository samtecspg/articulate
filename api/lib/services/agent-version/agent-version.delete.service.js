import {
    MODEL_AGENT_VERSION
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;

    try {
        const Agent = await redis.factory(MODEL_AGENT_VERSION);
        await Agent.findById({ id });
        return await Agent.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
