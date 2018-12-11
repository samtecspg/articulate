import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, data, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);
    try {
        await Model.findBySessionId({ sessionId });
        if (Model.inDb) {
            await Model.updateInstance({ data });
            return returnModel ? Model : Model.allProperties();
        }
        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
