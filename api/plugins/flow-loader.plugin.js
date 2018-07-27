'use strict';
const noflo = require('noflo');
const util = require('util');
const Boom = require('boom');
const name = 'flow-loader';
const _ = require('lodash');
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
                                    ready: component.isReady(),
                                    subGraph: component.isSubgraph(),
                                };
                                console.log(util.inspect(log, { colors: true }));
                            });
                    });
            });
        server.ext('onPreHandler', (request, reply) => {
            const settings = request.route.settings.plugins[name];
            if (settings) {
                const graph = noflo.asCallback(settings.name, { loader });
                const promisedGraph = util.promisify(graph);
                let data = { request };
                if (_.isArray(settings.consumes)) {
                    settings.consumes.forEach((service) => {
                        data[service] = server.app[service];
                    });
                }
                promisedGraph(data)
                    .then((result) => {
                        if (result.error) {
                            return reply.continue();
                        }
                        request.plugins[name] = result.out;
                        return reply.continue();
                    })
                    .catch((err) => {
                        const error = Boom.notFound(err.message);
                        return reply(error);
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
