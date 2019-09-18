import Boom from 'boom';
import _ from 'lodash';
import {
    MODEL_ACCESS_POLICY_GROUP,
    MODEL_USER_ACCOUNT,
    PARAM_NAME,
    PARAM_PASSWORD,
    PARAM_SALT
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ id = undefined, data, filterSensitiveData = false, returnModel = false }) {

    const { redis } = this.server.app;
    const { securityService, globalService } = await this.server.services();

    try {
        const model = await redis.factory(MODEL_USER_ACCOUNT, id);
        const groups = await globalService.findAll({ model: MODEL_ACCESS_POLICY_GROUP });
        const invalidGroups = _.difference(data.groups, _.map(groups.data, PARAM_NAME));
        if (invalidGroups.length !== 0) {
            throw Boom.illegal(`The following groups are not valid: [${invalidGroups.join(', ')}]`);
        }
        if (!_.isNil(data.password) && !_.isEmpty(data.password)) {
            const { passwordHash, salt } = securityService.saltHashPassword({ password: data.password });
            data.password = passwordHash;
            data.salt = salt;
        }
        await model.createInstance({ data });
        let properties = model.allProperties();
        if (filterSensitiveData) {
            properties = _.omit(properties, [PARAM_PASSWORD, PARAM_SALT]);
        }
        return returnModel ? model : properties;
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
