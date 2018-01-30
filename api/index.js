'use strict';

const Hapi = require('hapi');
const Routes = require('./config/routes');
const Redis = require('redis');

require('dotenv').load();

module.exports = (callback) => {

    const server = new Hapi.Server();
    server.connection({ port: 8000, routes: { cors: true } });

    server.app.rasa = process.env.RASA_URL ? process.env.RASA_URL : 'http://localhost:5000';
    server.app.duckling = process.env.DUCKLING_URL ? process.env.DUCKLING_URL : 'http://localhost:8500';
    server.app.redis = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
    server.app.rasa_er_pipeline = process.env.DOCKER_CONTAINER && process.env.DOCKER_CONTAINER === 'YES' ? require('./rasa-er-pipeline.json') : require('../helpers-stuff/rasa/rasa-er-pipeline.json');

    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    callback(null, server);
    /* $lab:coverage:on$ */
};
