'use strict';
const noflo = require('noflo');
const util = require('util');
const name = 'flow-loader';

exports.register = (server, options, next) => {
    const { baseDir, ...rest } = options;
    const loader = new noflo.ComponentLoader(baseDir, rest);
    loader.listComponents(() => {

        Object
            .keys(loader.components)
            .forEach((componentName) => {
                loader
                    .load(componentName, (err, component) => {
                        if (err) {
                            return next(err);
                        }
                        component
                            .start((err) => {
                                if (err) {
                                    console.error(err);
                                }
                                const log = {
                                    name: componentName,
                                    ready: component.isReady()
                                };
                                console.log(util.inspect(log, { colors: true }));
                            });
                    });
            });
        server.ext('onPreHandler', (request, reply) => {
            const settings = request.route.settings.plugins[name];
            const inport = settings.port || 'in';
            if (settings) {
                const graph = noflo.asCallback(settings.name, { loader });
                const promisedGraph = util.promisify(graph);
                promisedGraph({ [inport]: request })
                    .then((result) => {
                        if (result.error) {
                            return reply.continue();
                        }
                        // TODO: configure outport from route config or default to `out`
                        request.plugins[name] = result.out;
                        return reply.continue();
                    })
                    .catch((err) => {
                        // TODO: Manage error
                        return reply.continue();
                    });

            } else {
                return reply.continue();
            }
        });
        next();
    });
    server.plugins[name] = { loader };
};

exports.register.attributes = { name, once: true };
