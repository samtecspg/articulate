import { MODEL_POST_FORMAT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    try {
        const PostFormatModel = await redis.factory(MODEL_POST_FORMAT, id);
        return PostFormatModel.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `${MODEL_POST_FORMAT} id=[${id}]` });
    }

};
