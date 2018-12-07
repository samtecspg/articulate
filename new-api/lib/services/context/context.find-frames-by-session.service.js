import {
    MODEL_CONTEXT,
    MODEL_FRAME
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, returnModel = false, skip, limit, direction, field  }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);
    const { globalService } = await this.server.services();
    try {
        await Model.findBySessionId({ sessionId });
        const FrameModel = await redis.factory(MODEL_FRAME);
        if (Model.inDb) {
            //Only load frames if we are NOT returning the model, or else we can't create and object with a frames list.
            if (!returnModel) {
                // const frames = await globalService.loadAllLinked({ parentModel: Model, model: MODEL_FRAME, returnModel });
                const frameIds = await Model.getAll(MODEL_FRAME, MODEL_FRAME)

                const FrameModels = await FrameModel.findAllByIds({ ids: frameIds, skip, limit, direction, field });
                const frames = await Promise.all(FrameModels.map(async (frameModel) => {

                    const saying = await frameModel.allProperties();
                    return saying;
                }));
                
                return frames;
            }
            return returnModel ? Model : Model.allProperties();
        }
        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
