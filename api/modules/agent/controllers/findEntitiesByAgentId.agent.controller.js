'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const redis = request.server.app.redis;
    let start = 0;
    if (request.query && request.query.start > -1){
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1){
        limit = request.query.limit;
    }
    const agentId = request.params.id;

    Async.waterfall([
        (cb) => {

            redis.zrange(`agentEntities:${agentId}`, start, limit === -1 ? limit : limit - 1, 'withscores', (err, entities) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the entities from the sorted set.');
                    return cb(error);
                }
                entities =_.chunk(entities, 2);
                return cb(null, entities);
            });
        },
        (entities, cb) => {

            Async.map(entities, (entity, callback) => {

                request.server.inject('/entity/' + entity[1], (res) => {
                    
                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error ocurred getting the data of the entity ${entity[1]}`);
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
