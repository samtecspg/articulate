'use strict';
const Async = require('async');
const Boom = require('boom');
    
module.exports = (request, reply) => {

    let agentId = null;
    const agent = request.payload;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.incr('agentId', (err, newAgentId) => {
                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new agent id.');
                    return cb(error);
                }
                agentId = newAgentId;
                return cb(null);
            });
        },
        (cb) => {

            redis.zadd('agents', agentId, agent.agentName, (err, zAddResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the agents list.');
                    return cb(error);
                }
                return cb(null, zAddResponse);
            });
        },
        (addResponse, cb) => {

            if (addResponse !== 0){             
                Async.parallel([
                    (callback) => {

                        redis.hmset('agent:' + agentId, 
                                    'agentName', agent.agentName, 
                                    'webhookUrl', agent.webhookUrl ? agent.webhookUrl : '', 
                                    'domainClassifierThreshold', agent.domainClassifierThreshold, 
                                    'useWebhookFallback', agent.useWebhookFallback, (err) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the agent data.');
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {
    
                        redis.lpush('agentFallbacks:' + agentId, agent.fallbackResponses, (err) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding fallback responses.');
                                return callback(error);
                            }
                            return callback(null);
                        });
                    }
                ], (errParallel, resultParallel) => {
    
                    if (errParallel){
                        return cb(errParallel, null);
                    }
                    return cb(null);
                });
            }
            else{
                const error = Boom.badRequest('An agent with this name already exists.');
                return cb(error, null);
            }
        },
        (cb) => {

            Async.parallel([
                (callback) => {

                    redis.hgetall('agent:' + agentId, (hgetallErr, replies) => {

                        if (hgetallErr){
                            const error = Boom.badImplementation('An error ocurred retrieving the created agent.');
                            return callback(error);
                        }
                        return callback(null, replies);
                    });
                },
                (callback) => {

                    redis.lrange('agentFallbacks:' + agentId, 0, -1, (lRangeErr, lRangeResponse) => {

                        if (lRangeErr){
                            const error = Boom.badImplementation('An error ocurred retrieving the list of created fallback responses for the agent.');
                            return callback(error);
                        }
                        return callback(null, lRangeResponse);
                    })
                }
            ], (errParallel, resultParallel) => {

                if (errParallel){
                    return cb(errParallel);
                }
                return cb(null, resultParallel);
            });
        }
    ], (err, result) => {
        if (err){
            return reply(err, null);
        }
        return reply(Object.assign({ id: agentId }, result[0], { fallbackResponses: result[1] }));
    });
};