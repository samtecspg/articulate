'use strict';
const Async = require('async');
const Boom = require('boom');
    
module.exports = (request, reply) => {

    let agentId = null;
    const agent = request.payload;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {
            redis.incr('agentId', (incrErr, newAgentId) => {
                if (incrErr){
                    const error = Boom.badImplementation('An error ocurred getting the new agent id.');
                    return reply(error);
                }
                agentId = newAgentId;
                return cb(null);
            });
        },
        (cb) => {
            redis.zadd('agents', agentId, agent.agentName, (zAddErr, zAddResponse) => {
                if (zAddErr){
                    const error = Boom.badImplementation('An error ocurred adding the name to the agents list.');
                    return reply(error);
                }
                return cb(null, zAddResponse);
            });
        },
        (addResponse, cb) => {
            if (addResponse !== 0){
                redis.hmset('agent:' + agentId, 'agentName', agent.agentName, 'webhookUrl', agent.webhookUrl, 'domainClassifierThreshold', agent.domainClassifierThreshold, 'useWebhookFallback', agent.useWebhookFallback);
                if (agent.webhookFallbackUrl){
                    redis.hset('agent:' + agentId, 'webhookFallbackUrl', agent.webhookFallbackUrl);
                }
                
                redis.lpush('agentFallbacks:' + agentId, agent.fallbackResponses, (lPushErr, lPushResponse) => {
                    if (lPushErr){
                        const error = Boom.badImplementation('An error ocurred adding fallback responses.');
                        return cb(error);
                    }
                    return cb(null);
                });
            }
            else{
                const error = Boom.badRequest('An agent with this name already exists.');
                return reply(error, null);
            }
        },
        (cb) => {
            Async.parallel([
                (callback) => {
                    request.server.app.redis.hgetall('agent:' + agentId, (hgetallErr, replies) => {
                        if (hgetallErr){
                            const error = Boom.badImplementation('An error ocurred retrieving the created agent.');
                            return cb(error);
                        }
                        return callback(null, replies);
                    });
                },
                (callback) => {
                    redis.lrange('agentFallbacks:' + agentId, 0, -1, (lRangeErr, lRangeResponse) => {
                        if (lRangeErr){
                            const error = Boom.badImplementation('An error ocurred retrieving the list of created fallback responses for the agent.');
                            return cb(error);
                        }
                        return callback(null, lRangeResponse);
                    })
                }
            ], (errParallel, resultParallel) => {
                if (errParallel){
                    return cb(errParallel, null);
                }
                return cb(null, resultParallel);
            })
        }
    ], (err, result) => {
        return reply(Object.assign({ _id: agentId }, result[0], { fallbackResponses: result[1] }));
    });
};