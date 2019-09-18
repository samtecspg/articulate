import _ from 'lodash';
import {
    ACL_ACTION_READ,
    ACL_ACTION_WRITE,
    MODEL_ACCESS_POLICY_GROUP,
    MODEL_AGENT,
    MODEL_CONNECTION,
    MODEL_USER_ACCOUNT,
    PARAM_NAME,
    PARAM_RULES
} from '../../util/constants';
import { AUTH_FORCE_DEFAULT_GROUP } from '../../util/env';

const logger = require('../../util/logger')({ name: `server:init:defaultGroup` });
const DEFAULT_NAME = 'admin';
module.exports = async (server) => {

    const { redis } = server.app;
    const { globalService } = await server.services();
    const { accessControlService } = await server.services();
    const createGroup = async () => {

        const rules = {
            [`${MODEL_AGENT}:${ACL_ACTION_READ}`]: true,
            [`${MODEL_AGENT}:${ACL_ACTION_WRITE}`]: true,
            [`${MODEL_CONNECTION}:${ACL_ACTION_READ}`]: true,
            [`${MODEL_CONNECTION}:${ACL_ACTION_WRITE}`]: true,
            [`${MODEL_USER_ACCOUNT}:${ACL_ACTION_READ}`]: true,
            [`${MODEL_USER_ACCOUNT}:${ACL_ACTION_WRITE}`]: true,
            [`${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_READ}`]: true,
            [`${MODEL_ACCESS_POLICY_GROUP}:${ACL_ACTION_WRITE}`]: true
        };
        try {
            logger.info(`Creating group`);
            const group = await globalService.searchByField({ field: PARAM_NAME, value: DEFAULT_NAME, model: MODEL_ACCESS_POLICY_GROUP });
            if (group && !_.isArray(group)) {
                const PolicyGroupModel = await redis.factory(MODEL_ACCESS_POLICY_GROUP, group.id);
                PolicyGroupModel.property(PARAM_RULES, rules);
                await PolicyGroupModel.save();
                logger.info(`Group updated successfully`);
            }
            else {
                await accessControlService.upsert({
                    data: {
                        name: DEFAULT_NAME,
                        rules
                    }
                });
                logger.info(`Group created successfully`);
            }

        }
        catch (e) {
            logger.error(e);
        }
    };
    if (AUTH_FORCE_DEFAULT_GROUP) {
        return await createGroup();
    }
};
