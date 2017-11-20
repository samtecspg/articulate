'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const IntentTools = require('../tools');
const _ = require('lodash');

const redis = require('redis');

const updateDataFunction = (redis, server, rasa, intentId, currentIntent, updateData, agentId, domainId, cb) => {

    const flatIntent = Flat(currentIntent);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatIntent[key] = flatUpdateData[key]; 
    });

    redis.hmset(`intent:${intentId}`, flatIntent, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred adding the intent data.');
            return cb(error);
        }

        const resultIntent = Flat.unflatten(flatIntent);
        const equal = _.eq(updateData.examples, currentIntent.examples) && updateData.agent === currentIntent.agent && updateData.domain === currentIntent.domain;
        if (updateData.examples && !equal){
            Async.series([
                Async.apply(IntentTools.updateEntitiesDomainTool, redis, resultIntent, agentId, domainId),
                (callback) => {
    
                    Async.parallel([
                        Async.apply(IntentTools.retrainModelTool, server, rasa, resultIntent.agent, resultIntent.domain, domainId),
                        Async.apply(IntentTools.retrainDomainRecognizerTool, server, rasa, resultIntent.agent, agentId)
                    ], (err) => {
        
                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err) => {
        
                if (err) {
                    return cb(err);
                }
        
                return cb(null, resultIntent);
            });

        }
        else {
            return cb(null, resultIntent);
        }
    });
}

module.exports = (request, reply) => {

    const intentId = request.params.id;
    let agentId = null;
    let domainId = null;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/intent/${intentId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified intent doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the intent ${intentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentIntent, cb) => {

            redis.zscore('agents', currentIntent.agent, (err, id) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the id of the agent.');
                    return cb(error);
                }
                if (id){
                    agentId = id;
                    return cb(null, currentIntent);
                }
                else {
                    const error = Boom.badRequest(`The agent ${intent.agent} doesn't exist`);
                    return cb(error, null);
                }
            });
        },
        (currentIntent, cb) => {

            redis.zscore(`agentDomains:${agentId}`, currentIntent.domain, (err, id) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the id of the domain.');
                    return cb(error);
                }
                if (id){
                    domainId = id;
                    return cb(null, currentIntent);
                }
                else {
                    const error = Boom.badRequest(`The domain ${currentIntent.domain} doesn't exist`);
                    return cb(error, null);
                }
            });
        },
        (currentIntent, cb) => {

            if (updateData.intentName && updateData.intentName !== currentIntent.intentName){
                Async.waterfall([
                    (callback) => {

                        redis.zadd(`domainIntents:${domainId}`, 'NX', intentId, updateData.intentName, (err, addResponse) => {
                            
                            if (err) {
                                const error = Boom.badImplementation(`An error ocurred adding the name ${updateData.intentName} to the intents list of the domain ${currentIntent.domain}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            else {
                                const error = Boom.badRequest(`A intent with the name ${updateData.intentName} already exists in the domain ${updateData.domain}.`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {
                        
                        redis.zrem(`domainIntents:${domainId}`, currentIntent.intentName, (err, addResponse) => {
                            
                            if (err){
                                const error = Boom.badImplementation( `An error ocurred removing the name ${currentIntent.intentName} from the intents list of the agent ${currentIntent.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, server, rasa, intentId, currentIntent, updateData, agentId, domainId, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the intent data.');
                                return callback(error);
                            }
                            return callback(null, result);
                        });
                    }
                ], (err, result) => {
                    
                    if (err){
                        return cb(err);
                    }
                    return cb(null, result);
                });
            }
            else {
                updateDataFunction(redis, server, rasa, intentId, currentIntent, updateData, agentId, domainId, (err, result) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the intent data.');
                        return cb(error);
                    }
                    return cb(null, result);
                });
            }
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }

        redis.hmset(`scenario:${result.id}`, { agent: result.agent, domain: result.domain, intent: result.intentName }, (err) => {
            
            if (err){
                const error = Boom.badImplementation('Intent updated. An error ocurred updating the new values in the scenario of the intent.');
                return reply(error);
            }
            return reply(null);
        });
    });
};
