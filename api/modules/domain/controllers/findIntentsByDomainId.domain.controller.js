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
    let filter = '';
    if (request.query.filter && request.query.filter.trim() !== ''){
        filter = request.query.filter;
    }
    let total = 0;
    const domainId = request.params.id;

    Async.waterfall([
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the domain');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`domainIntents:${domainId}`, 0, -1, 'withscores', (err, intents) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the intents of the domain from the sorted set.');
                    return cb(error);
                }
                intents = _.chunk(intents, 2);
                total = intents.length;
                if (filter && filter !== ''){
                    intents = _.filter(intents, (intent) => {

                        return intent[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = intents.length;
                }
                intents = _.sortBy(_.map(intents, (intent) => {

                    return { intentName: intent[0], id: intent[1] };
                }), 'intentName');
                if (limit !== -1){
                    intents = intents.slice(start, limit);
                }
                return cb(null, intents);
            });
        },
        (intents, cb) => {

            Async.map(intents, (intent, callback) => {

                server.inject('/intent/' + intent.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the intent ${intent.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { intents: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
