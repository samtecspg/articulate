'use strict';
const Async = require('async');
const Boom = require('boom');
    
module.exports = (request, reply) => {

    const agent = request.payload;
    const redis = request.server.app.redis;
    
    var args = [ 'agents', agent.agentName];        
    redis.zrank(args, (zRankErr, zRankResp) => {
        if (zRankErr){
            const error = Boom.badImplementation('An error ocurred calling redis. Please try again');
            return reply(error);
        }
        
        if (!zRankResp && zRankResp != 0) {
            redis.incr('agentId', (incrErr, agentId) => {
                if (incrErr){
                    const error = Boom.badImplementation('An error ocurred getting the new agent id.');
                    return reply(error);
                }
                redis.zadd('agents', agentId, agent.agentName, (zAddErr, zAddResponse) => {
                    if (zAddErr){
                        const error = Boom.badImplementation('An error ocurred adding the name to the agents list.');
                        return reply(error);
                    }
                    redis.hmset('agent:' + agentId, 'agentName', agent.agentName, 'webhookUrl', agent.webhookUrl, 'domainClassifierThreshold', agent.domainClassifierThreshold, 'useWebhookFallback', agent.useWebhookFallback);
                    if (agent.webhookFallbackUrl){
                        redis.hset('agent:' + agentId, 'webhookFallbackUrl', agent.webhookFallbackUrl);
                    }

                    Async.forEach(agent.fallbackResponses, (fallbackResponse, cb) => {
                        redis.lpush('agentFallbacks:' + agentId, fallbackResponse, (lPushErr, lPushResponse) => {
                            if (lPushErr){
                                const error = Boom.badImplementation('An error ocurred adding fallback responses.');
                                return cb(error);
                            }
                            return cb(null);
                        });
                    }, (forEachErr) => {
                        if (forEachErr){
                            return reply(forEachErr);
                        }
                        request.server.app.redis.hgetall('agent:' + agentId, (hgetallErr, replies) => {
                            if (hgetallErr){
                                const error = Boom.badImplementation('An error ocurred retrieving the created agent.');
                                return cb(error);
                            }
                            redis.lrange('agentFallbacks:' + agentId, 0, -1, (lRangeErr, lRangeResponse) => {
                                if (lRangeErr){
                                    const error = Boom.badImplementation('An error ocurred retrieving the list of created fallback responses for the agent.');
                                    return cb(error);
                                }
                                return reply(Object.assign({ _id: agentId }, replies, { fallbackResponses: lRangeResponse }));
                            })
                        });
                    });
                });
            })
        }
        else{
            const error = Boom.badRequest('An agent with this name already exists.');
            return reply(error, null);
        }
    });
};