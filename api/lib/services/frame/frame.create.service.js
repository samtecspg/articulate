import { MODEL_FRAME } from '../../../util/constants';
import GlobalDefaultError from '../../errors/global.default-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, context = null, returnModel = false }) {

    const { redis } = this.server.app;
    const FrameModel = await redis.factory(MODEL_FRAME);
    if (context === null) {
        return Promise.reject(GlobalDefaultError({
            message: `Context can't be null for a frame`
        }));
    }
    try {
        await FrameModel.createInstance({ data });
        await context.link(FrameModel, MODEL_FRAME);
        await context.saveInstance();
        return returnModel ? FrameModel : FrameModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
