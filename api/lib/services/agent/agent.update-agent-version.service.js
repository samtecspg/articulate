import _ from 'lodash';
import {
    MODEL_AGENT_VERSION
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, agentVersionId, agentVersionData }) {

    const { redis } = this.server.app;

    try {
        const VersionModel = await redis.factory(MODEL_AGENT_VERSION, agentVersionId);
        if (!VersionModel.isLoaded) {
            return Promise.reject(NotFoundError({ agentVersionId, model: MODEL_AGENT_VERSION }));
        }

        agentVersionData.versionNameAgentId = agentVersionData.agentName + agentVersionData.originalAgentVersionId;
        await VersionModel.updateInstance({ data: agentVersionData });
        return VersionModel;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
