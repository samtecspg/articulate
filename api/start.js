'use strict';

const Server = require('./index');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

Server((err, server) => {

    if (err) {
        throw err;
    }

    const optionsDoc = {
        info: {
            title: 'Natural Language Understanding API Documentation',
            version: Pack.version,
            contact: {
                name: 'Smart Platform Group'
            }
        }
    };

    server.register([Inert, Vision, { 'register': HapiSwagger, 'options': optionsDoc }], (err) => {

        if (err) {
            console.log(err);
        }
        server.start( (errStart) => {

            if (errStart) {
                console.log(errStart);
            }
            else {
                console.log('Server running at: ' + server.info.uri + '\n Explorer running at: ' + server.info.uri + '/documentation');
            }
        });
    });
});
