'use strict';
// Load modules

const Hapi = require('hapi');
const Vision = require('../..');


// Declare internals

const internals = {};


const handler = function (request, reply) {

    reply.view('withLayout/index', {
        title: 'examples/views/handlebars/layout.js | Hapi ' + request.server.version,
        message: 'Hello World!\n'
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
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',
            layout: true
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
