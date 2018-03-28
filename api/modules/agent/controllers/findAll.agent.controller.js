'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    let start = 0;
    if (request.query && request.query.start > -1){
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1){
        limit = request.query.limit;
    }

    Async.waterfall([
        (cb) => {

            redis.zrange('agents', start, limit === -1 ? limit : limit - 1, 'withscores', (err, agents) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the agents from the sorted set.');
                    return cb(error);
                }
                agents = _.chunk(agents, 2);
                return cb(null, agents);
            });
        },
        (agents, cb) => {

            Async.map(agents, (agent, callback) => {

                server.inject('/agent/' + agent[1], (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of agent ${agent[0]} with id ${agent[1]}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, result);
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
