'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const ContextTools = require('../tools');
    
module.exports = (request, reply) => {

    let contextId = null;
    let agentId = null;
    let domainId = null;
    let intentId = null;
    let context = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        fathersCheck: (cb) => {
            
            Async.series([
                (callback) => {

                    redis.zscore('agents', context.agent, (err, id) => {
                        
                        if (err){
                            const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id){
                            agentId = id;
                            return callback(null);
                        }
                        else{
                            const error = Boom.badRequest(`The agent ${context.agent} doesn't exist`);
                            return callback(error, null);
                        }
                    });
                },
                (callback) => {
                    
                    redis.zscore(`agentDomains:${agentId}`, context.domain, (err, id) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred checking if the domain ${context.domain} exists in the agent ${context.agent}.`);
                            return callback(error);
                        }
                        if (id){
                            domainId = id;
                            return callback(null);
                        }
                        else {
                            const error = Boom.badRequest(`The domain ${context.domain} doesn't exist in the agent ${context.agent}`);
                            return callback(error);
                        }
                    });
                },
                (callback) => {

                    Async.parallel([
                        (cllbk) => {

                            redis.zscore(`domainIntents:${domainId}`, context.intent, (err, id) => {
                                
                                if (err){
                                    const error = Boom.badImplementation(`An error ocurred checking if the intent ${context.intent} exists in the domain ${context.domain}.`);
                                    return cllbk(error);
                                }
                                if (id){
                                    intentId = id;
                                    return cllbk(null);
                                }
                                else {
                                    const error = Boom.badRequest(`The intent ${context.intent} doesn't exist in the domain ${context.domain}`);
                                    return cllbk(error);
                                }
                            });
                        },
                        (cllbk) => {

                            ContextTools.validateEntitiesTool(redis, agentId, context.slots, (err) => {
                                
                                if (err) {
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null);
            });
        },
        contextId: (cb) => {

            redis.incr('contextId', (err, newContextId) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new context id.');
                    return cb(error);
                }
                contextId = newContextId;
                return cb(null);
            });
        },
        context: (cb) => {

            context = Object.assign({id: contextId}, context);          
            const flatContext = Flat(context);  
            redis.hmset(`context:${intentId}`, flatContext, (err) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the context data.');
                    return cb(error);
                }
                return cb(null, context);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result.context);
    });
};