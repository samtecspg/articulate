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
        documentationPage: false
    };

    process.env.SWAGGER_SCHEMES ? swaggerOptions.schemes = [process.env.SWAGGER_SCHEMES] : null
    process.env.SWAGGER_HOST ? swaggerOptions.host = process.env.SWAGGER_HOST : null
    process.env.SWAGGER_BASE_PATH ? swaggerOptions.basePath = process.env.SWAGGER_BASE_PATH : swaggerOptions.basePath = '/'

    // We added in HapiSwaggerUI because HapiSwagger hadn't been updated and had an SSL bug.
    const swaggerUIOptions = {
        title: 'Articulate API Documentation',
        path: '/documentation',
        // basePath: swaggerUIPath,
        swaggerOptions: {
            validatorUrl: false
        },
        authorization: false,
        swaggerEndpoint: '/swagger.json'
    };

    process.env.SWAGGER_BASE_PATH ? swaggerUIOptions.basePath = process.env.SWAGGER_BASE_PATH : swaggerUIOptions.basePath = '/'

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
