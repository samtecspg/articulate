import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, frameId }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();

    try {
        const Session = await redis.factory(MODEL_CONTEXT);
        await Session.findBySessionId({ sessionId });
        const Frame = await globalService.findById({id: frameId, model: MODEL_FRAME, returnModel: true});

        const belongs = await Session.belongsTo( Frame , MODEL_FRAME);
        console.log(belongs);

        if (belongs) {
            await Frame.removeInstance();
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
