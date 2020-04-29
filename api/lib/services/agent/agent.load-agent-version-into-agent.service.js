import { MODEL_AGENT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, agentVersionId }) {

    const { agentService } = await this.server.services();
    try {
        let version = await agentService.export({ id: agentVersionId, isVersionCreation: true });
        version.isVersionImport = true;
        version.isOriginalAgentVersion = true;
        version.lastTraining = "2020-01-01T00:00:00Z";
        version.categories.forEach(function (category, index, categories) {
            if (categories[index].lastTraining === 'Invalid date') {
                categories[index].lastTraining = "2020-01-01T00:00:00Z";
            }
        });
        var importedAgent = await agentService.import({ payload: version })
        return importedAgent;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
