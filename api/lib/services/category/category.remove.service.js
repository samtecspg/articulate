import {
    MODEL_CATEGORY,
    MODEL_SAYING,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';
import GlobalDefaultError from '../../errors/global.default-error';

module.exports = async function ({ id, CategoryModel, AgentModel, isBulk = false }) {

    const { redis } = this.server.app;
    try {
        CategoryModel = CategoryModel || await redis.factory(MODEL_CATEGORY, id);
        if (isBulk) {
            return CategoryModel.removeInstance();
        }
        const categorySayingIds = await CategoryModel.getAll(MODEL_SAYING, MODEL_SAYING);
        if (categorySayingIds.length > 0) {
            const categoryName = await CategoryModel.allProperties().categoryName;
            return Promise.reject(GlobalDefaultError({
                statusCode: 400,
                message: `Category '${categoryName}' is been used by ${categorySayingIds.length} sayings`
            }));
        }

        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.saveInstance();
        return CategoryModel.removeInstance();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Category id=[${id}]` });
    }

};
