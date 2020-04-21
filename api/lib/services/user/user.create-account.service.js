import _ from 'lodash';
import {
    DEFAULT_GROUP_NAME,
    MODEL_USER_ACCOUNT,
    PARAM_PASSWORD,
    PARAM_SALT,
    PROVIDER_BASIC
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ data, identity = null, filterSensitiveData = false, returnModel = false }) {

    const { redis } = this.server.app;
    const { userService, securityService } = await this.server.services();

    const model = await redis.factory(MODEL_USER_ACCOUNT);
    try {
        if (data.provider === PROVIDER_BASIC) {
            const { passwordHash, salt } = securityService.saltHashPassword({ password: data.password });
            data.password = passwordHash;
            data.salt = salt;
            identity = null;
        }
        data.groups = [DEFAULT_GROUP_NAME];
        await model.createInstance({ data: _.omit(data, ['provider']) });
        let properties = model.allProperties();
        if (filterSensitiveData) {
            properties = _.omit(properties, [PARAM_PASSWORD, PARAM_SALT]);
        }

        if (identity) {
            await userService.addIdentity({ identityData: identity, UserAccountModel: model, filterSensitiveData });
            properties.identities = [identity];
        }
        return returnModel ? model : properties;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
