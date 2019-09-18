import _ from 'lodash';
import {
    ERROR_NOT_FOUND,
    MODEL_ACCESS_POLICY_GROUP,
    PARAM_NAME
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ name }) {

    const { redis } = this.server.app;
    const { globalService } = await this.server.services();
    const AccessPolicyGroup = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
    try {
        const Model = await globalService.searchByField({ field: PARAM_NAME, value: name, model: MODEL_ACCESS_POLICY_GROUP });
        if (Model && !_.isArray(Model)) {
            return await AccessPolicyGroup.removeInstance({ id: Model.id });
        }
        return await Promise.reject(ERROR_NOT_FOUND);
    }
    catch (error) {
        throw RedisErrorHandler({ error, message: `Access policy [${name}] not found` });
    }
};
