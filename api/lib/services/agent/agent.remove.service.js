import { MODEL_AGENT, MODEL_CONNECTION } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    const { globalService, connectionService } = await this.server.services();
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
        const AgentVersions = await globalService.findAll({ model: MODEL_AGENT, filter: { originalAgentVersionId: id } });

        await Promise.all(AgentVersions.data.map(async (Version) => {
            await Agent.findById({ id: Version.id });
            await Agent.removeInstance({ id: Version.id });
        }));

        await Agent.findById({ id });
        return Agent.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Agent id=[${id}]` });
    }

};
