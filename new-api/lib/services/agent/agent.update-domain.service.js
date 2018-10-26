import {
    MODEL_AGENT,
    MODEL_DOMAIN,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, domainId, domainData, returnModel = false }) {

    const { globalService } = await this.server.services();

    try {
        const modelPath = [MODEL_AGENT, MODEL_DOMAIN];
        const modelPathIds = [id, domainId];

        // Load Used Models
        const models = await globalService.getAllModelsInPath({ modelPath, ids: modelPathIds, returnModel: true });
        const AgentModel = models[MODEL_AGENT];
        const DomainModel = models[MODEL_DOMAIN];
        domainData.status = STATUS_OUT_OF_DATE;
        await DomainModel.updateInstance({ data: domainData });
        // TODO: Publish Agent update
        AgentModel.property('status', STATUS_OUT_OF_DATE);
        await AgentModel.save();
        return returnModel ? DomainModel : DomainModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
