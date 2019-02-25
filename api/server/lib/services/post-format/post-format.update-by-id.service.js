import { MODEL_POST_FORMAT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, data, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_POST_FORMAT);
    try {
        await Model.updateInstance({ id, data });
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
