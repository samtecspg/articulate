'use strict';

const Server = require('./index');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const HapiSwaggerUI = require('hapi-swaggered-ui');
const Pack = require('./package');

Server((err, server) => {

    if (err) {
        console.error(err);
        console.log('process.exit(1)');
        return process.exit(1);
    }

    const swaggerOptions = {
        info: {
            title: 'Articulate API Documentation',
            version: Pack.version,
            contact: {
                name: 'Smart Platform Group'
            }
        },
        schemes: process.env.SWAGGER_SCHEMES ? [process.env.SWAGGER_SCHEMES] : ['http'],
        host: process.env.SWAGGER_HOST || 'localhost:7500',
        basePath: process.env.SWAGGER_BASE_PATH || '/',
        documentationPage: false
    };

    const swaggerUIScheme = process.env.SWAGGER_SCHEMES ? [process.env.SWAGGER_SCHEMES][0] : 'http';
    const swaggerUIPath = swaggerUIScheme + '://' +
                        (process.env.SWAGGER_HOST || 'localhost:7500') +
                        (process.env.SWAGGER_BASE_PATH || '');


    const swaggerUIOptions = {
        title: 'Articulate API Documentation',
        path: '/documentation',
        basePath: swaggerUIPath,
        swaggerOptions: {
            validatorUrl: false,
        },
        authorization: false,
        swaggerEndpoint: (process.env.SWAGGER_BASE_PATH || '') + '/swagger.json'
    };

    server.register([
        Inert,
        Vision,
        { 'register': HapiSwagger, 'options': swaggerOptions },
        { 'register': HapiSwaggerUI, 'options': swaggerUIOptions }
    ], (err) => {

        if (err) {
            console.log(err);
        }
        server.start((errStart) => {

            if (errStart) {
                console.log(errStart);
            }
            else {
                console.log('Server running at:   ' + server.info.uri + '\nExplorer running at: ' + server.info.uri + '/documentation');
            }
        });
    });
});
