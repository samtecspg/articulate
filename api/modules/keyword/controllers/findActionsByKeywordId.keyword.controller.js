'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    let start = 0;
    if (request.query && request.query.start > -1) {
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1) {
        limit = request.query.limit;
    }
    const id = request.params.id;

    Async.waterfall([
        (cb) => {

            server.inject(`/keyword/${id}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified keyword doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the keyword');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`keywordActions:${id}`, start, limit, 'withscores', (err, actions) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the actions from the sorted set.');
                    return cb(error);
                }
                actions = _.chunk(actions, 2);
                return cb(null, actions);
            });
        },
        (actions, cb) => {

            Async.map(actions, (action, callback) => {

                server.inject(`/action/${action[1]}`, (res) => {

                    if (res.statusCode !== 200) {
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the action ${action[0]} with id ${action[1]}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });

            }, (err, result) => {

                if (err) {
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
