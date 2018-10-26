import {
    MODEL_AGENT,
    MODEL_DOMAIN
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, domainId }) {

    const { globalService, domainService } = await this.server.services();
    try {

        const modelPath = [MODEL_AGENT, MODEL_DOMAIN];
        const modelPathIds = [id, domainId];
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const DomainModel = models[MODEL_DOMAIN];
        return await domainService.remove({ DomainModel, AgentModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
