'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const IntentTools = require('../tools');
    
module.exports = (request, reply) => {

    let intentId = null;
    let agentId = null;
    let domainId = null;
    let intent = request.payload;
    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;

    Async.series({
        fathersCheck: (cb) => {
            
            Async.series([
                (callback) => {

                    redis.zscore('agents', intent.agent, (err, id) => {
                        
                        if (err){
                            const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id){
                            agentId = id;
                            return callback(null);
                        }
                        else{
                            const error = Boom.badRequest(`The agent ${intent.agent} doesn't exist`);
                            return callback(error, null);
                        }
                    });
                },
                (callback) => {
                    Async.parallel([
                        (cllbk) => {
                            
                            redis.zscore(`agentDomains:${agentId}`, intent.domain, (err, id) => {
                                
                                if (err){
                                    const error = Boom.badImplementation(`An error ocurred checking if the domain ${intent.domain} exists in the agent ${intent.agent}.`);
                                    return cllbk(error);
                                }
                                if (id){
                                    domainId = id;
                                    return cllbk(null);
                                }
                                else {
                                    const error = Boom.badRequest(`The domain ${intent.domain} doesn't exist in the agent ${intent.agent}`);
                                    return cllbk(error);
                                }
                            });
                        },
                        (cllbk) => {

                            IntentTools.validateEntitiesTool(redis, agentId, intent.examples, (err) => {
                                
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
        intentId: (cb) => {

            redis.incr('intentId', (err, newIntentId) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new intent id.');
                    return cb(error);
                }
                intentId = newIntentId;
                return cb(null);
            });
        },
        addToDomain: (cb) => {

            redis.zadd(`domainIntents:${domainId}`, 'NX', intentId, intent.intentName, (err, addResponse) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the intents list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                else{
                    const error = Boom.badRequest(`A intent with this name already exists in the domain ${intent.domain}.`);
                    return cb(error);
                }
            });
        },
        intent: (cb) => {

            intent = Object.assign({id: intentId}, intent);          
            const flatIntent = Flat(intent);  
            redis.hmset(`intent:${intentId}`, flatIntent, (err) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the intent data.');
                    return cb(error);
                }
                return cb(null, intent);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }

        const resultIntent = result.intent;

        Async.series([
            Async.apply(IntentTools.updateEntitiesDomainTool, redis, resultIntent, agentId, domainId, null),
            (cb) => {

                Async.parallel([
                    Async.apply(IntentTools.retrainModelTool, server, rasa, resultIntent.agent, resultIntent.domain, domainId),
                    Async.apply(IntentTools.retrainDomainRecognizerTool, server, rasa, resultIntent.agent, agentId)
                ], (err) => {
    
                    if (err){
                        return cb(err);
                    }
                    return cb(null);
                });
            }
        ], (err) => {
    
            if (err) {
                return reply(err);
            }
    
            return reply(null, resultIntent);
        });
    });
};