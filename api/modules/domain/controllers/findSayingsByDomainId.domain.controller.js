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

            redis.zrange(`domainSayings:${domainId}`, 0, -1, 'withscores', (err, sayings) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the sayings of the domain from the sorted set.');
                    return cb(error);
                }
                sayings = _.chunk(sayings, 2);
                total = sayings.length;
                if (filter && filter !== ''){
                    sayings = _.filter(sayings, (saying) => {

                        return saying[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = sayings.length;
                }
                sayings = _.sortBy(_.map(sayings, (saying) => {

                    return { sayingName: saying[0], id: saying[1] };
                }), 'sayingName');
                if (limit !== -1){
                    sayings = sayings.slice(start, limit);
                }
                return cb(null, sayings);
            });
        },
        (sayings, cb) => {

            Async.map(sayings, (saying, callback) => {

                server.inject('/saying/' + saying.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the saying ${saying.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { sayings: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
