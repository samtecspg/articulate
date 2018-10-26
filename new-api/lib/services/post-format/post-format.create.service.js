import { MODEL_POST_FORMAT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, parent = null, returnModel = false }) {

    const { redis } = this.server.app;

    const PostFormatModel = await redis.factory(MODEL_POST_FORMAT);
    try {
        await PostFormatModel.createInstance({ data });
        await parent.link(PostFormatModel, MODEL_POST_FORMAT);
        await parent.save();
        return returnModel ? PostFormatModel : PostFormatModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
