import {
    MODEL_AGENT,
    MODEL_DOMAIN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, domainId, domainData, returnModel = false }) {

    const { globalService, domainService } = await this.server.services();

    try {
        const modelPath = [MODEL_AGENT, MODEL_DOMAIN];
        const modelPathIds = [id, domainId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const DomainModel = models[MODEL_DOMAIN];
        return await domainService.train({ AgentModel, DomainModel, returnModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
