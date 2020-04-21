import Boom from 'boom';
import Hoek from 'hoek';
import Joi from 'joi';
import _ from 'lodash';
import Package from '../../../package.json';
import {
    MODEL_AGENT,
    MODEL_USER_ACCOUNT,
    P_GBAC,
    P_HAPI_ABAC,
    PARAM_AGENT_ID
} from '../../../util/constants';
import Logger from '../../../util/logger';

const name = P_HAPI_ABAC;
const logger = Logger({ name: `plugin:${name}` });
const internals = {};
const defaults = {};
const schemas = {};

defaults.options = {
    onError: (request, h, err) => {

        throw err.isBoom ? err : Boom.boomify(err, 401);
    },

    responseCode: {
        onDeny: 401,
        onUndetermined: 401
    }
};

schemas.registerOptions = Joi.object({
    onError: Joi.func().optional(),
    responseCode: Joi.object({
        onDeny: Joi.number().optional(),
        onUndetermined: Joi.number().optional()
    }).optional(),
    enabled: Joi.boolean().optional()
});

schemas.routeOption = [
    Joi.string(),
    Joi.array().items(Joi.string())
];

internals.policyHandler = (server, options) => {

    return async (request, h) => {

        const { redis } = server.app;
        const credentials = request.auth.credentials;
        const {
            [PARAM_AGENT_ID]: agentId
        } = request.params;
        try {
            const routePolicies = request.route.settings.plugins[name];
            if (!routePolicies) {
                return h.continue;
            }
            Joi.assert(routePolicies, schemas.routeOption, `[${name}] Route option`);

            if (!credentials) {
                if (request.auth.mode === 'optional') {
                    return h.continue;
                }
                return options.onError(request, h, new Boom('Missing authentication', {
                    statusCode: options.responseCode.onUndetermined
                }));
            }

            const { id: userId } = request.auth.credentials;
            const User = await redis.factory(MODEL_USER_ACCOUNT, userId);
            if (User.property('groups').indexOf('admin') >= 0) {
                return h.continue;
            }
            const Agent = await redis.factory(MODEL_AGENT, agentId);
            const agentAccessControlPolicies = Agent.property('accessPolicies');
            const agentUserAccessControlPolicy = agentAccessControlPolicies[User.id];
            if (!agentUserAccessControlPolicy) {
                return options.onError(request, h, new Boom('User not allowed', {
                    statusCode: options.responseCode.onDeny
                }));
            }
            const isAllowedReducer = (accumulator, currentValue) => {

                if (accumulator === undefined) {
                    return currentValue === undefined ? undefined : currentValue;
                }
                return accumulator || currentValue;
            };
            const isAllowed = routePolicies.map((policy) => agentUserAccessControlPolicy[policy]).reduce(isAllowedReducer, undefined);
            if (isAllowed === undefined || !isAllowed) {
                return options.onError(request, h, new Boom('User not allowed', {
                    statusCode: options.responseCode.onDeny
                }));
            }
            return h.continue;
        }
        catch (err) {
            logger.debug(err);

            return options.onError(request, h, err);
        }
    };
};
module.exports = {
    name,
    pkg: Package,
    register: (server, options) => {

        Joi.assert(options, schemas.registerOptions, `[${name}] option`);

        options = Hoek.applyToDefaults(defaults.options, options);
        if (!_.get(options, 'enabled', true)) {
            logger.info('disabled');
            return;
        }

        try {
            options = Hoek.applyToDefaults(defaults.options, options);
            server.dependency(P_GBAC, () => {

                server.ext('onPostAuth', internals.policyHandler(server, options));
            });
            logger.info('registered');
        }
        catch (e) {
            console.error('hapi Attribute Access Control error');
            throw e;
        }

    }
};
