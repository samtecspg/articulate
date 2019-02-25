import {
    MODEL_AGENT,
    MODEL_CATEGORY,
    MODEL_SAYING
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, categoryId, sayingId }) {

    const { globalService, sayingService } = await this.server.services();

    try {
        const modelPath = [MODEL_AGENT, MODEL_CATEGORY, MODEL_SAYING];
        const modelPathIds = [id, categoryId, sayingId];
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const CategoryModel = models[MODEL_CATEGORY];
        const SayingModel = models[MODEL_SAYING];

        return await sayingService.remove({ SayingModel, AgentModel, CategoryModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Agent id=[${id}] error removing Saying id=[${sayingId}]` });
    }

};
