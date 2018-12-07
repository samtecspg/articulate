import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();

    try {
        const Model = await redis.factory(MODEL_CONTEXT);
        await Model.findBySessionId({ sessionId });

        if (Model.inDb) {
            const FrameModels = await globalService.loadAllLinked({ parentModel: Model, model: MODEL_FRAME, returnModel: true });
            return await Promise.all(FrameModels.map(async (FrameModel) => {
    
                await FrameModel.removeInstance();
            }));
        } else {
            return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
