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

    const { globalService, actionService } = await this.server.services();

    try {
        AgentModel = AgentModel || await globalService.findById({ id, model: MODEL_AGENT, returnModel: true });
        return await actionService.upsert({ data: actionData, actionId, AgentModel, returnModel });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
