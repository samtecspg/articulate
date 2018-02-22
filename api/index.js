'use strict';
require('dotenv').load();
const INIT_RETRY = process.env.INIT_RETRY || 10;
const INIT_RETRY_TIMEOUT = process.env.INIT_RETRY_TIMEOUT || 15000;

const Hapi = require('hapi');
const Routes = require('./config/routes');
const Redis = require('redis');
const async = require('async');
const _ = require('lodash');
const ERPipeline = require('./rasa-er-pipeline.json');

module.exports = callback => init(callback);

const init = callback => async.series({ redis: initRedis, server: initHapi },
    function (err, results) {
        if (err) {
            console.error('Failed during initialization');
            return callback(err);
        } else {
            const { redis, server } = results;
            server.app.redis = redis;
            callback(null, server);
        }
    });

const retryStrategy = options => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
        console.log(`Connection failed. Attempt ${options.attempt} of ${INIT_RETRY}`);
        if (options.attempt === INIT_RETRY) {
            console.error(`Failure during Redis connection `);
            console.error(options.error);
            return process.exit(1);
        } else {
            return INIT_RETRY_TIMEOUT;
        }
    }
    return INIT_RETRY_TIMEOUT;
};

const initRedis = next => {
    const client = Redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, { retry_strategy: retryStrategy });
    next = _.once(next); //Prevent calling the async next when there is an error after a successful connection
    // Wait for connection
    client.once('ready', () => {
        return next(null, client);
    });

    // Listen to errors
    client.on('error', err => {
        return next(err);
    });
};

const initHapi = next => {
    const server = new Hapi.Server();
    server.connection({ port: 8000, routes: { cors: true } });
    server.app.rasa = process.env.RASA_URL ? process.env.RASA_URL : 'http://localhost:5000';
    server.app.duckling = process.env.DUCKLING_URL ? process.env.DUCKLING_URL : 'http://localhost:8500';
    server.app.rasa_er_pipeline = ERPipeline;

    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    return next(null, server);
    /* $lab:coverage:on$ */
};
