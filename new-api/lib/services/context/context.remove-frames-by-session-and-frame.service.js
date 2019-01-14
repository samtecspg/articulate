import {
    MODEL_FRAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, frameId  }) {

    const { contextService } = await this.server.services();

    try {
        const Frame = await contextService.findFrameBySessionAndFrame({ sessionId, frameId, returnModel: true });
        if (Frame.inDb) {
            await Frame.removeInstance();
        }
        else {
            return Promise.reject(NotFoundErrorHandler({ model: MODEL_FRAME, id: frameId }));
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
