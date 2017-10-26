'use strict';
// Load modules

const Hapi = require('hapi');
const Vision = require('../..');


// Declare internals

const internals = {};


const rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/ejs/basic.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
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
            engines: { ejs: require('ejs') },
            relativeTo: __dirname,
            path: 'templates/basic'
        });

        server.route({ method: 'GET', path: '/', handler: rootHandler });
        server.start((err) => {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
