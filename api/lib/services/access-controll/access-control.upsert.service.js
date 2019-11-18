import Boom from 'boom';
import _ from 'lodash';
import {
    MODEL_ACCESS_POLICY_GROUP,
    PARAM_NAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

const logger = require('../../../util/logger')({ name: `service:ac:create` });
module.exports = async function ({ data, returnModel = false }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const AccessPolicyGroup = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
    try {
        const { name, rules } = data;
        const Models = await globalService.searchByField({ field: PARAM_NAME, value: name, model: MODEL_ACCESS_POLICY_GROUP });
        const defaults = AccessPolicyGroup.defaults;
        const filteredRules = _.pick(rules, _.keys(defaults.rules));
        if (Models && !_.isArray(Models)) {
            if (Models.isAdmin === true) {
                throw RedisErrorHandler({ error: new Boom.forbidden(`Group [${name}] is read only.`) });
            }

            await AccessPolicyGroup.updateInstance({ id: Models.id, data: { name, rules: { ...defaults.rules, ...filteredRules } } });
        }
        else {
            await AccessPolicyGroup.createInstance({ data: { name, rules: { ...defaults.rules, ...filteredRules } } });

        }
        return returnModel ? AccessPolicyGroup : AccessPolicyGroup.allProperties();
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
