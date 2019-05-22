import {
    MODEL_ACTION,
    MODEL_AGENT
} from '../../../util/constants';
import GlobalDefaultErrorHandler from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, actionId }) {

    const { redis } = this.server.app;
    const { globalService, actionService } = await this.server.services();
    try {
        const modelPath = [
            { model: MODEL_AGENT, id },
            { model: MODEL_ACTION, id: actionId }
        ];
        // Validate action belongs to agent
        const ActionModel = await globalService.findInModelPath({ modelPath, returnModel: true });
        const AgentModel = await redis.factory(MODEL_AGENT, id);
        if (ActionModel.data.property('actionName') === AgentModel.property('fallbackAction')){
            return Promise.reject(GlobalDefaultErrorHandler({ statusCode: 400, message: 'You can\'t delete this action as it is being used as the fallback action of this agent' }));
        }
        return await actionService.remove({ id: actionId });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
