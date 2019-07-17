import {
    MODEL_CONTEXT
} from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);
    try {
        await Model.findBySessionId({ sessionId });
        if (Model.inDb) {
            return returnModel ? Model : Model.allProperties();
        }
        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
