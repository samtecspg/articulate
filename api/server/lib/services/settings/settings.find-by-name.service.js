import { MODEL_SETTINGS } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ name, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_SETTINGS);

    try {
        await Model.findByName({ name });
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
