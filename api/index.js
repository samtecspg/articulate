'use strict';

const Hapi = require('hapi');
const Routes = require('./config/routes');
const Redis = require('redis');

require('dotenv').load();

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 8000, routes: { cors: true } });

    server.app.rasa = process.env.RASA_URL;
    server.app.duckling = process.env.DUCKLING_URL;
    server.app.redis = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    callback(null, server);
    /* $lab:coverage:on$ */
};
