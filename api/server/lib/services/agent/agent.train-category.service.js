import {
    MODEL_AGENT,
    MODEL_CATEGORY
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, categoryId, categoryData, returnModel = false }) {

    const { globalService, categoryService } = await this.server.services();

    try {
        const modelPath = [MODEL_AGENT, MODEL_CATEGORY];
        const modelPathIds = [id, categoryId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const CategoryModel = models[MODEL_CATEGORY];
        return await categoryService.train({ AgentModel, CategoryModel, returnModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
