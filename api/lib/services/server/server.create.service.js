import _ from 'lodash';
import {
    MODEL_SERVER,
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const ServerModel = await redis.factory(MODEL_SERVER);
    try {

        await ServerModel.createInstance({ data });
        return returnModel ? ServerModel : ServerModel.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
