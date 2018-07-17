import {
    MODEL_AGENT,
    STATUS_OUT_OF_DATE
} from '../../../util/constants';
import NotFoundError from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, data, returnModel = false }) {

    const { redis } = this.server.app;
    try {
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        if (!AgentModel.isLoaded) {
            return Promise.reject(NotFoundError({ id, model: MODEL_AGENT }));
        }

        const requiresRetrain =
            (
                data.extraTrainingData !== undefined &&
                data.extraTrainingData !== AgentModel.property('extraTrainingData')
            ) ||
            (
                data.enableModelsPerCategory !== undefined &&
                data.enableModelsPerCategory !== AgentModel.property('enableModelsPerCategory')
            ) ||
            (
                data.agentName !== undefined &&
                data.agentName !== AgentModel.property('agentName')
            );
        data.status = requiresRetrain ? STATUS_OUT_OF_DATE : data.status;
        // TODO: Publish Agent update
        await AgentModel.updateInstance({ data });
        return returnModel ? AgentModel : AgentModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
