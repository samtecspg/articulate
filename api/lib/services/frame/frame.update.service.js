import { MODEL_FRAME } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, data, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const FrameModel = await redis.factory(MODEL_FRAME, id);

        await FrameModel.updateInstance({ data });
        return returnModel ? FrameModel : FrameModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
