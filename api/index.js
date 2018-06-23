'use strict';
require('dotenv').load();
const INIT_RETRY = process.env.INIT_RETRY || 10;
const INIT_RETRY_TIMEOUT = process.env.INIT_RETRY_TIMEOUT || 15000;

const Hapi = require('hapi');
const Routes = require('./config/routes');
const Redis = require('redis');
const Async = require('async');
const _ = require('lodash');
const StartDB = require('./helpers/startDB');

module.exports = (callback) => init(callback);

const init = (callback) => {

    return Async.series({ redis: initRedis, server: initHapi },
        (err, results) => {

            if (err) {
                console.error('Failed during initialization');
                return callback(err);
            }

            const { redis, server } = results;
            server.app.redis = redis;

            StartDB(server, redis, (err) => {

                if (err){
                    const error = new Error(`An error ocurred checking DB default settings. Error detail: ${err}`);
                    callback(error);
                }
                callback(null, server);
            });
        });
};

const retryStrategy = (options) => {

    if (options.error && options.error.code === 'ECONNREFUSED') {
        console.log(`Connection failed. Attempt ${options.attempt} of ${INIT_RETRY}`);
        if (options.attempt === INIT_RETRY) {
            console.error('Failure during Redis connection ');
            console.error(options.error);
            return process.exit(1);
        }

        return INIT_RETRY_TIMEOUT;

    }
    return INIT_RETRY_TIMEOUT;
};

const initRedis = (next) => {

    const redisPort = process.env.REDIS_PORT || 6379;
    const redisHost = process.env.REDIS_HOST || 'redis';

    const client = Redis.createClient(redisPort, redisHost, { retry_strategy: retryStrategy });
    next = _.once(next); //Prevent calling the async next when there is an error after a successful connection
    // Wait for connection
    client.once('ready', () => {

        return next(null, client);
    });

    // Listen to errors
    client.on('error', (err) => {

        return next(err);
    });
};

const initHapi = (next) => {

    const server = new Hapi.Server();
    server.connection({ port: 7500, routes: { cors: true } });

    /* $lab:coverage:off$ */
    for (const route in Routes) {
        if (Routes.hasOwnProperty(route)) {
            server.route(Routes[route]);
        }
    }
    return next(null, server);
    /* $lab:coverage:on$ */
};
