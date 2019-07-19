import {
    MODEL_CONTEXT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ sessionId, returnModel = false }) {

    const { redis } = this.server.app;
    let Model = await redis.factory(MODEL_CONTEXT);
    try {
        await Model.findBySessionId({ sessionId });
        if (Model.inDb) {
            return returnModel ? Model : Model.allProperties();
        }
        else {
            Model = await redis.factory(MODEL_CONTEXT);
            const data = {
                sessionId,
                actionQueue: [],
                docIds: [],
                savedSlots: {}
            }
            await Model.createInstance({ data });
            return returnModel ? Model : Model.allProperties();
        }
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
