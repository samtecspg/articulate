import { MODEL_WEBHOOK } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, parent = null, returnModel = false }) {

    const { redis } = this.server.app;

    const model = await redis.factory(MODEL_WEBHOOK);
    try {
        await model.createInstance({ data });
        await parent.link(model, MODEL_WEBHOOK);
        await parent.save();
        return returnModel ? model : model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
