import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, frameId, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();

    try {
        const Session = await redis.factory(MODEL_CONTEXT);
        await Session.findBySessionId({ sessionId });
        const Frame = await globalService.findById({id: frameId, model: MODEL_FRAME, returnModel: true});

        if (Session.inDb) {
            if (Frame.inDb) {
                const belongs = await Session.belongsTo( Frame , MODEL_FRAME);

                if (belongs) {
                    return returnModel ? Frame : Frame.allProperties();
                }
            } else {
                return Promise.reject(NotFoundErrorHandler({ model: MODEL_FRAME, id: frameId }));
            }
        } else {
            return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
