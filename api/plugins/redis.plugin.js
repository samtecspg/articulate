'use strict';
const name = 'redis';
const _ = require('lodash');
const Redis = require('redis');

exports.register = (server, options, next) => {

    const { host, port, retry, retryTimeout } = options;
    next = _.once(next); //Prevent calling the async next when there is an error after a successful connection

    const retryStrategy = (settings) => {

        if (settings.error && settings.error.code === 'ECONNREFUSED') {
            console.log(`Connection failed. Attempt ${settings.attempt} of ${retry}`);
            if (settings.attempt === retry) {
                console.error('Failure during Redis connection ');
                console.error(settings.error);
                return process.exit(1);
            }

            return retryTimeout;

        }
        return retryTimeout;
    };

    const client = Redis.createClient(port, host, { retry_strategy: retryStrategy });
    // Wait for connection
    client.once('ready', () => {

        server.app[name] = client;
        return next();
    });

    // Listen to errors
    client.on('error', (err) => {

        return next(err);
    });
};

exports.register.attributes = { name, once: true };
