import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ session, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);

    try {
        await Model.findBySession({ session });
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
