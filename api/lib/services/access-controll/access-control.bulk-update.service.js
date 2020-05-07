import _ from 'lodash';
import {
    MODEL_ACCESS_POLICY_GROUP,
    PARAM_NAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

const logger = require('../../../util/logger')({ name: `service:ac:bulk-upsert` });
module.exports = async function ({ data }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();

    return await Promise.all(_.forEach(data, async (group) => {

        try {
            const { name, rules } = group;
            const AccessPolicyGroup = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
            const defaults = AccessPolicyGroup.defaults;

            const Models = await globalService.searchByField({ field: PARAM_NAME, value: name, model: MODEL_ACCESS_POLICY_GROUP });
            if (Models && !_.isArray(Models)) {
                if (Models.isAdmin === true) {
                    return Models;
                }
                const filteredRules = _.pick(rules, _.keys(defaults.rules));
                await AccessPolicyGroup.updateInstance({ id: Models.id, data: { isAdmin: Models.isAdmin, name, rules: { ...defaults.rules, ...filteredRules } } });
            }
        }
        catch (error) {
            throw RedisErrorHandler({ error });
        }
    }));

};
