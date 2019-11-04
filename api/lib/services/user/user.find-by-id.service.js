import _ from 'lodash';
import {
    MODEL_USER_ACCOUNT,
    P_GBAC,
    PARAM_PASSWORD,
    PARAM_SALT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id, filterSensitiveData = false, includeAccessPolicies = false, returnModel = false }) {

    const { redis } = this.server.app;
    try {
        const UserModel = await redis.factory(MODEL_USER_ACCOUNT, id);
        let properties = UserModel.allProperties();
        if (filterSensitiveData) {
            properties = _.omit(properties, [PARAM_PASSWORD, PARAM_SALT]);
        }
        if (returnModel) {
            return UserModel;
        }

        if (includeAccessPolicies) {
            const policies = await this.server.app[P_GBAC].getSimplifiedPolicy({ groups: properties.groups });
            return { ...properties, ...{ simplifiedGroupPolicies: policies } };
        }
        return { properties };

    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
