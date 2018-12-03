import {
    MODEL_CATEGORY,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, CategoryModel, AgentModel }) {

    const { redis } = this.server.app;
    try {
        const SayingModel = await redis.factory(MODEL_SAYING);
        CategoryModel = CategoryModel || await redis.factory(MODEL_CATEGORY, id);
        const categorySayingIds = await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING);
        await Promise.all(categorySayingIds.map(async (currentId) => {

            return await SayingModel.removeInstance({ id: currentId });
        }));

        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.save();
        return CategoryModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Category id=[${id}]` });
    }

};
