import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();

    try {
        const Model = await redis.factory(MODEL_CONTEXT);
        await Model.findBySessionId({ sessionId });
        const FrameModels = await globalService.loadAllLinked({ parentModel: Model, model: MODEL_FRAME, returnModel: true });
        return await Promise.all(FrameModels.map(async (FrameModel) => {

            await FrameModel.removeInstance();
        }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
