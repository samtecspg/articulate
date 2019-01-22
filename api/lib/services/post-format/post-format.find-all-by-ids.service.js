import { MODEL_POST_FORMAT } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ ids }) {

    const { redis } = this.server.app;

    try {
        const Model = await redis.factory(MODEL_POST_FORMAT);
        return await Model.findAllByIds({ ids });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

};
