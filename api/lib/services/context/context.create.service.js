import { MODEL_CONTEXT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const Model = await redis.factory(MODEL_CONTEXT);
    try {
        data.actionQueue = [];
        data.docIds = [];
        data.savedSlots = {};
        data.listenFreeText = false;
        await Model.createInstance({ data });
        return returnModel ? Model : Model.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
