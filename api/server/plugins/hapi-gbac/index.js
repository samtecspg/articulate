import Boom from 'boom';
import Hoek from 'hoek';
import Joi from 'joi';
import _ from 'lodash';
import Package from '../../../package.json';
import {
    MODEL_USER_ACCOUNT,
    P_GBAC,
    P_HAPI_GBAC,
    PARAM_GROUPS
} from '../../../util/constants';

const name = P_HAPI_GBAC;
const logger = require('../../../util/logger')({ name: `plugin:${name}` });
const internals = {};
const defaults = {};
const schemas = {};
const CONFIG_NONE = 'none';

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
        try {
            if (!request.auth.credentials) {
                if (request.auth.mode === 'optional') {
                    return h.continue;
                }
                return options.onError(request, h, new Boom('Missing authentication', {
                    statusCode: options.responseCode.onUndetermined
                }));
            }
            const { id: userId } = request.auth.credentials;
            const User = await redis.factory(MODEL_USER_ACCOUNT, userId);
            const userGroup = User.property(PARAM_GROUPS);
            const routePolicies = request.route.settings.plugins[name] || options.policy;
            Joi.assert(routePolicies, schemas.routeOption, `[${name}] Route option`);

            if (routePolicies && routePolicies !== CONFIG_NONE) {
                const validation = await server.app[P_GBAC].validate({ groups: userGroup, policies: routePolicies });
                if (validation.error) {
                    logger.debug({ message: `Allowed = ${validation.isAllowed}`, path: request.path, config: routePolicies });
                    return options.onError(request, h, new Boom(validation.error, {
                        statusCode: options.responseCode.onUndetermined
                    }));
                }
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
            server.dependency('gbac', () => {

                server.ext('onPostAuth', internals.policyHandler(server, options));
            });
            logger.info('registered');
        }
        catch (e) {
            console.error('elasticsearch cluster is down!');
            throw e;
        }

    }
};
