'use strict';
// Load modules

const Hoek = require('hoek');
const Joi = require('joi');
const Manager = require('./manager');
// Additional helper modules required in constructor


// Declare internals

const internals = {};


internals.schema = Joi.alternatives([
    Joi.string(),
    Joi.object({
        template: Joi.string(),
        context: Joi.object(),
        options: Joi.object()
    })
]);


exports.register = function (server, pluginOptions, next) {

    server.decorate('server', 'views', function (options) {

        Hoek.assert(options, 'Missing views options');
        this.realm.plugins.vision = this.realm.plugins.vision || {};
        Hoek.assert(!this.realm.plugins.vision.manager, 'Cannot set views manager more than once');

        if (!options.relativeTo &&
            this.realm.settings.files.relativeTo) {

            options = Hoek.shallow(options);
            options.relativeTo = this.realm.settings.files.relativeTo;
        }

        const manager = new Manager(options);
        this.realm.plugins.vision.manager = manager;
        return manager;
    });

    server.decorate('server', 'render', internals.render);
    server.decorate('request', 'render', internals.render);

    server.handler('view', internals.handler);

    server.decorate('reply', 'view', function (template, context, options) {

        const realm = (this.realm.plugins.vision || this.request.server.realm.plugins.vision || {});
        Hoek.assert(realm.manager, 'Cannot render view without a views manager configured');
        return this.response(realm.manager._response(template, context, options, this.request));
    });

    return next();
};

exports.register.attributes = {
    connections: false,
    once: true,
    pkg: require('../package.json')
};


internals.render = function (template, context, options, callback) {

    if (!callback && typeof options === 'function') {
        callback = options;
        options = {};
    }

    const isServer = (typeof this.route === 'function');
    const server = (isServer ? this : this.server);
    const vision = ((!isServer ? this.route.realm.plugins.vision : null) || server.realm.plugins.vision || server.root.realm.plugins.vision || {});
    Hoek.assert(vision.manager, 'Missing views manager');
    return vision.manager.render(template, context, options, callback);
};


internals.handler = function (route, options) {

    Joi.assert(options, internals.schema, 'Invalid view handler options (' + route.path + ')');

    if (typeof options === 'string') {
        options = { template: options };
    }

    const settings = {                                                // Shallow copy to allow making dynamic changes to context
        template: options.template,
        context: options.context,
        options: options.options
    };

    return function (request, reply) {

        const context = {
            params: request.params,
            payload: request.payload,
            query: request.query,
            pre: request.pre
        };

        if (settings.context) {                                     // Shallow copy to avoid cloning unknown objects
            const keys = Object.keys(settings.context);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                context[key] = settings.context[key];
            }
        }

        reply.view(settings.template, context, settings.options);
    };
};
