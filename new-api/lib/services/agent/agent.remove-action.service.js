import {
    MODEL_ACTION,
    MODEL_AGENT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, actionId }) {

    const { globalService, actionService } = await this.server.services();
    try {
        const modelPath = [
            { model: MODEL_AGENT, id },
            { model: MODEL_ACTION, id: actionId }
        ];
        // Validate action belongs to agent
        await globalService.findInModelPath({ modelPath, returnModel: true });
        return await actionService.remove({ id: actionId });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
