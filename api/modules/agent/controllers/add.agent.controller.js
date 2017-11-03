'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
    
module.exports = (request, reply) => {

    let agentId = null;
    let agent = request.payload;
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

            redis.zadd('agents', 'NX', agentId, agent.agentName, (err, zAddResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the agents list.');
                    return cb(error);
                }
                return cb(null, zAddResponse);
            });
        },
        (addResponse, cb) => {

            if (addResponse !== 0){
                agent = Object.assign({id: agentId}, agent);          
                const flatAgent = Flat(agent);  
                redis.hmset('agent:' + agentId, flatAgent, (err) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the agent data.');
                        return cb(error);
                    }
                    return cb(null, agent);
                });
            }
            else{
                const error = Boom.badRequest('An agent with this name already exists.');
                return cb(error, null);
            }
        }
    ], (err, result) => {
        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};