import { MODEL_CONTEXT } from '../../../util/constants';
import NotFoundErrorHandler from '../../errors/global.not-found-error';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId }) {

    const { redis } = this.server.app;
    try {
        const Model = await redis.factory(MODEL_CONTEXT);
        await Model.findBySessionId({ sessionId });
        if (Model.inDb) {
            return await Model.removeInstance();
        }
        return Promise.reject(NotFoundErrorHandler({ model: MODEL_CONTEXT, id: sessionId }));

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
