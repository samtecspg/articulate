import _ from 'lodash';
import {
    MODEL_USER_ACCOUNT,
    PARAM_PASSWORD,
    PARAM_SALT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, filterSensitiveData = false, returnModel = false }) {

    const { redis } = this.server.app;
    try {
        const UserModel = await redis.factory(MODEL_USER_ACCOUNT, id);
        let properties = UserModel.allProperties();
        if (filterSensitiveData) {
            properties = _.omit(properties, [PARAM_PASSWORD, PARAM_SALT]);
        }
        return returnModel ? UserModel : properties;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
