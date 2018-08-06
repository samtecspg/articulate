'use strict';
const NoFlo = require('noflo');
const Util = require('util');
const Boom = require('boom');
const name = 'flow-loader';
const _ = require('lodash');

exports.register = (server, options, next) => {

    const baseDir = options.baseDir;
    const rest = _.omit(options, 'baseDir');

    const loader = new NoFlo.ComponentLoader(baseDir, rest);
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
                                    subGraph: component.isSubgraph()
                                };
                                console.log(Util.inspect(log, { colors: true }));
                            });
                    });
            });
        server.ext('onPreHandler', (request, reply) => {

            const settings = request.route.settings.plugins[name];
            if (settings) {
                const graph = NoFlo.asCallback(settings.name, { loader });
                const promisedGraph = Util.promisify(graph);
                const data = { request };
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

            }
            else {
                return reply.continue();
            }
        });
        next();
    });
    server.plugins[name] = { loader };
};

exports.register.attributes = { name, once: true };
