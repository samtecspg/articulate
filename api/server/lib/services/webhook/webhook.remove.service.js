import { MODEL_WEBHOOK } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    try {
        const Model = await redis.factory(MODEL_WEBHOOK, id);
        return await Model.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
