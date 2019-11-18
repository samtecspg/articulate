import Joi from 'joi';
import _ from 'lodash';
import Package from '../../../package.json';
import {
    ERROR_NOT_FOUND,
    MODEL_ACCESS_POLICY_GROUP,
    P_GBAC,
    PARAM_NAME
} from '../../../util/constants';

const name = P_GBAC;
//const logger = require('../../../util/logger')({ name: `plugin:${name}` });
const internals = {};
const defaults = {};
const schemas = {};

defaults.options = {};

schemas.registerOptions = Joi.object({});

internals.validate = async ({ groups = [], policies = [] }) => {

    const groupPolicies = await internals.getSimplifiedPolicy({ groups });

    if (!groupPolicies) {
        return { isAllowed: false, error: 'No group policies found for the given group' };
    }
    const isAllowedReducer = (accumulator, currentValue) => {

        if (accumulator === undefined) {
            return currentValue === undefined ? undefined : currentValue;
        }
        return accumulator || currentValue;
    };
    const isAllowed = policies.map((policy) => groupPolicies[policy]).reduce(isAllowedReducer, undefined);
    if (isAllowed === undefined || !isAllowed) { //The group doesn't have any configuration for the route policy or is not allowed
        return { isAllowed: false, error: 'No policy found on the group policies' };
    }
    return { isAllowed };

};

internals.getGroupPolicy = async ({ group }) => {

    const { redis } = internals.server.app;
    const Model = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
    const accessPolicyGroup = await Model.searchByField({ field: PARAM_NAME, value: group });
    if (_.isArray(accessPolicyGroup)) {
        return;
    }
    if (accessPolicyGroup && _.isEmpty()) {
        return accessPolicyGroup;
    }
    throw ERROR_NOT_FOUND;
};

// Gets all the all the groups policies and merge them into a single one that shows all the allowed rules
internals.getSimplifiedPolicy = async ({ groups = [] }) => {

    const { redis } = internals.server.app;
    const Model = await redis.factory(MODEL_ACCESS_POLICY_GROUP);
    const policies = await Promise.all(groups.map((group) => internals.getGroupPolicy({ group }))) || [];
    const simplified = _.mergeWith(
        ...policies
            .filter((policy) => !_.isEmpty(policy)) //Remove empty elements from the list
            .map((policy) => policy.rules), // Get the rules list for each one
        (o, s) => o || s); // Merge


    return { ...Model.defaults.rules, ...simplified };
};

module.exports = {
    name,
    pkg: Package,
    register: (server, options) => {

        Joi.assert(options, schemas.registerOptions, `[${name}] option`);
        internals.server = server;
        internals.options = options;
        server.app[name] = {
            validate: internals.validate,
            getSimplifiedPolicy: internals.getSimplifiedPolicy
        };
    }
};
