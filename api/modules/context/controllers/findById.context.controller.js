'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');
const Flat = require('flat');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    const sessionId = request.params.sessionId;

    Async.waterfall([
        (cb) => {
            
            redis.lrange(`sessionContexts:${sessionId}`, 0, -1, (err, contextIds) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the agents from the sorted set.');
                    return cb(error);
                }
                return cb(null, contextIds);
            });
        },
        (contextIds, cb) => {

            Async.map(contextIds, (contextId, callback) => {
                
                redis.hgetall(`context:${contextId}`, (err, data) => {
                    
                    if (err){
                        const error = Boom.badImplementation(`An error ocurred retrieving the context ${contextId}.`);
                        return callback(error);
                    }
                    if (data){
                        return callback(null, Flat.unflatten(data));
                    }
                    else {
                        const error = Boom.notFound(`The context ${context} doesn\'t exists`);
                        return callback(error);                    
                    }
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
