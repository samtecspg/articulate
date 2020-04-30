import { MODEL_AGENT, MODEL_CONNECTION, MODEL_AGENT_VERSION } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { globalService, connectionService, agentVersionService } = await this.server.services();
    const Agent = await redis.factory(MODEL_AGENT);
    try {
        //TODO: Delete Categories
        //TODO: Delete Keyword
        //TODO: Delete agentCategoryRecognizer

        const Connections = await globalService.searchByField({ field: 'agent', value: id, model: MODEL_CONNECTION });
        if (Connections) {
            if (Connections.length > 0) {

                Connections.forEach(async (Connection) => {

                    await connectionService.updateById({ id: Connection.id, data: { agent: null } });
                });
            }
        }

        //Remove agent versions
        const AgentVersions = await globalService.findAll({ model: MODEL_AGENT_VERSION, filter: { originalAgentVersionId: id } });

        await Promise.all(AgentVersions.data.map(async (Version) => {
            await agentVersionService.delete({ id: Version.id })
        }));

        await Agent.findById({ id });
        return Agent.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Agent id=[${id}]` });
    }

};
