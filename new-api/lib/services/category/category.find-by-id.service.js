import { MODEL_CATEGORY } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const CategoryModel = await redis.factory(MODEL_CATEGORY, id);
        return returnModel ? CategoryModel : CategoryModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Category id=[${id}]` });
    }

};
