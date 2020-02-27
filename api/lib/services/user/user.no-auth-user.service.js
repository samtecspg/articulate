import _ from 'lodash';
import {
    MODEL_ACCESS_POLICY_GROUP,
    MODEL_USER_ACCOUNT,
    PARAM_PASSWORD,
    PARAM_SALT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function () {

    const { redis } = this.server.app;
    try {
        const PolicyGroupModel = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
        const defaultRules = PolicyGroupModel.defaults.rules;
        const adminRules = _.mapValues(defaultRules, () => true);
        const UserModel = await redis.factory(MODEL_USER_ACCOUNT);
        let properties = UserModel.allProperties();
        properties = _.omit(properties, [PARAM_PASSWORD, PARAM_SALT]);
        return { ...properties, ...{ id: undefined, name: undefined, email: undefined, simplifiedGroupPolicies: adminRules } };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
