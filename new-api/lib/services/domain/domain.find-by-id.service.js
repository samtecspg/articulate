import { MODEL_DOMAIN } from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, returnModel = false }) {

    const { redis } = this.server.app;

    try {
        const DomainModel = await redis.factory(MODEL_DOMAIN, id);
        return returnModel ? DomainModel : DomainModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Domain id=[${id}]` });
    }

};
