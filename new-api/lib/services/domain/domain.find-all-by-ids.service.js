import { MODEL_DOMAIN } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ ids }) {

    const { redis } = this.server.app;

    try {
        const DomainModel = await redis.factory(MODEL_DOMAIN);
        return await DomainModel.findAllByIds({ ids });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }

};
