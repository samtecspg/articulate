import { MODEL_WEBHOOK } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, data, returnModel = false }) {

    const { redis } = this.server.app;
    try {
        const Model = await redis.factory(MODEL_WEBHOOK, id);
        await Model.updateInstance({ data });
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
