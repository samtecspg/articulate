'use strict';
const Boom = require('boom');
const Async = require('async');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const redis = request.server.app.redis;

    Async.parallel([
        (callback) => {

            request.server.app.redis.hgetall('agent:' + agentId, (err, data) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the created agent.');
                    return callback(error);
                }
                if (data){
                    return callback(null, data);
                }
                else {
                    const error = Boom.notFound('The specified agent doesn\'t exists');
                    return callback(error);                    
                }
            });
        },
        (callback) => {

            redis.lrange('agentFallbacks:' + agentId, 0, -1, (err, fallbacks) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the list of created fallback responses for the agent.');
                    return callback(error);
                }
                return callback(null, fallbacks);
            })
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Object.assign({ id: agentId }, result[0], { fallbackResponses: result[1] }));
    });

};
