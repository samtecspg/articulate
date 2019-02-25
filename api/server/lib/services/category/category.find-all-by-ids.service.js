import { MODEL_CATEGORY } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ ids }) {

    const { redis } = this.server.app;

    try {
        const CategoryModel = await redis.factory(MODEL_CATEGORY);
        return await CategoryModel.findAllByIds({ ids });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

};
