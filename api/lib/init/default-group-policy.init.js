import _ from 'lodash';
import {
    DEFAULT_ADMIN_GROUP_NAME,
    DEFAULT_GROUP_NAME,
    MODEL_ACCESS_POLICY_GROUP,
    PARAM_IS_ADMIN,
    PARAM_NAME,
    PARAM_RULES
} from '../../util/constants';
import { AUTH_FORCE_DEFAULT_GROUP } from '../../util/env';

const logger = require('../../util/logger')({ name: `server:init:defaultGroup` });
module.exports = async (server) => {

    const { redis } = server.app;
    const { globalService } = await server.services();
    const { accessControlService } = await server.services();
    const PolicyGroupModel = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
    const defaultRules = PolicyGroupModel.defaults.rules;
    const adminRules = _.mapValues(defaultRules, () => true);
    const createGroup = async ({ name, rules, isAdmin = false }) => {

        try {
            const group = await globalService.searchByField({ field: PARAM_NAME, value: name, model: MODEL_ACCESS_POLICY_GROUP });
            if (group && !_.isArray(group) && !AUTH_FORCE_DEFAULT_GROUP) {
                return;
            }
            if (group && !_.isArray(group)) {
                const existingGroup = await redis.factory(MODEL_ACCESS_POLICY_GROUP, group.id);
                existingGroup.property(PARAM_RULES, rules);
                existingGroup.property(PARAM_IS_ADMIN, isAdmin);
                await existingGroup.save();
                logger.info(`Group [${name}] updated successfully`);
            }
            else {
                await accessControlService.upsert({
                    data: {
                        name,
                        isAdmin,
                        rules
                    }
                });
                logger.info(`Group [${name}] created successfully`);
            }

        }
        catch (e) {
            logger.error(e);
        }
    };
    await createGroup({ name: DEFAULT_ADMIN_GROUP_NAME, rules: adminRules, isAdmin: true });
    await createGroup({ name: DEFAULT_GROUP_NAME, rules: defaultRules, isAdmin: false });
};
