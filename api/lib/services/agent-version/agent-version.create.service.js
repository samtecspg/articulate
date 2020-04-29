import {
    MODEL_AGENT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService, agentService } = await this.server.services();

    try {

        const AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        if (!AgentModel.isLoaded) {
            return Promise.reject(NotFoundError({ id, model: MODEL_AGENT }));
        }
        let agentData = AgentModel.allProperties();
        agentData.currentAgentVersionCounter = agentData.currentAgentVersionCounter + 1;
        delete agentData.id;
        await agentService.updateById({ id, data: agentData });

        //Export current agent and import it as a version
        let exportedAgent = await agentService.export({ id });
        exportedAgent.originalAgentVersionName = exportedAgent.agentName;
        exportedAgent.agentName = exportedAgent.agentName + '_v' + exportedAgent.currentAgentVersionCounter;
        exportedAgent.loadedAgentVersionName = exportedAgent.agentName;
        exportedAgent.isOriginalAgentVersion = false;
        exportedAgent.originalAgentVersionId = Number(id);
        exportedAgent.agentVersionNotes = '';
        exportedAgent.versionNameAgentId = exportedAgent.agentName + id;
        var importedAgent = await agentService.import({ payload: { ...exportedAgent, isVersionCreation: true } })
        return importedAgent;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
