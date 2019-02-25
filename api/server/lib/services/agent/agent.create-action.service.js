import {
    MODEL_ACTION,
    MODEL_AGENT
} from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function (
    {
        id,
        AgentModel = null,
        actionId,
        actionData,
        returnModel = false
    }
) {

    const { globalService, actionService, agentService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        const isUnique = await agentService.isModelUnique({
            AgentModel,
            model: MODEL_ACTION,
            field: 'actionName',
            value: actionData.actionName
        });
        if (isUnique) {
            return await actionService.upsert({ data: actionData, actionId, AgentModel, returnModel });
        }
        return Promise.reject(GlobalDefaultError({
            message: `The ${MODEL_AGENT} already has a ${MODEL_ACTION} with the name= "${actionData.actionName}".`
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
