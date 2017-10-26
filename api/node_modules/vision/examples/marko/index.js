'use strict';
// Load modules

const Hapi = require('hapi');
const Marko = require('marko');
const Vision = require('../..');


// Declare internals

const internals = {};


const handler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/marko/basic.js | Hapi ' + request.server.version,
        message: 'Hello World!'
    });
};


internals.main = function () {

    const server = new Hapi.Server();
    server.connection({ port: 8000 });
    server.register(Vision, (err) => {

        if (err) {
            throw err;
        }

        server.views({
            engines: {
                html: {
                    compile: function (src, options) {

                        const template = Marko.load(options.filename, src);

                        return function (context) {

                            return template.renderSync(context);
                        };
                    }
                }
            },
            path: __dirname + '/templates'
        });

        server.route({ method: 'GET', path: '/', handler });
        server.start((err) => {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
