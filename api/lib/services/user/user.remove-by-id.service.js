import _ from 'lodash';
import {
    MODEL_USER_ACCOUNT,
    PARAM_PASSWORD,
    PARAM_SALT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id }) {

    const { redis } = this.server.app;
    try {
        const UserModel = await redis.factory(MODEL_USER_ACCOUNT, id);
        
        return UserModel.removeInstance({ id });
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
