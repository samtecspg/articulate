'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const IntentTools = require('../tools');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    let intent;
    let agentId;
    let domainId;
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
                intent = res.result;
                return cb(null);
            });
        },
        (callbackDeleteIntentAndReferences) => {

            Async.parallel([
                (callbackDeleteIntent) => {

                    redis.del(`intent:${intentId}`, (err, result) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred deleting the intent ${intentId}`);
                            return callbackDeleteIntent(error, null);
                        }
                        return callbackDeleteIntent(null);
                    });
                },
                (callbackDeleteScenario) => {

                    redis.del(`scenario:${intentId}`, (err, result) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred deleting the scenario ${intentId}`);
                            return callbackDeleteScenario(error, null);
                        }
                        return callbackDeleteScenario(null);
                    });
                },
                (callbackDeleteIntentFromTheDomain) => {
                    
                    Async.waterfall([
                        (callbackGetAgent) => {

                            redis.zscore(`agents`, intent.agent, (err, score) => {
                                
                                if (err){
                                    const error = Boom.badImplementation( `An error ocurred retrieving the id of the agent ${intent.agent}`);
                                    return callbackGetAgent(error);
                                }
                                agentId = score;
                                return callbackGetAgent(null);
                            });
                        },
                        (callbackGetDomain) => {

                            redis.zscore(`agentDomains:${agentId}`, intent.domain, (err, score) => {
                                
                                if (err){
                                    const error = Boom.badImplementation( `An error ocurred retrieving the id of the domain ${intent.domain}`);
                                    return callbackGetDomain(error);
                                }
                                domainId = score;
                                return callbackGetDomain(null);
                            });
                        },
                        (callbackRemoveFromDomainsList) => {

                            redis.zrem(`domainIntents:${domainId}`, intent.intentName, (err, removeResult) => {
                                
                                if (err){
                                    const error = Boom.badImplementation( `An error ocurred removing the intent ${intentId} from the intents list of the domain ${domainId}`);
                                    return callbackRemoveFromDomainsList(error);
                                }
                                return callbackRemoveFromDomainsList(null);
                            });
                        }
                    ], (err, result) => {
                        
                        if (err){
                            return callbackDeleteIntentFromTheDomain(err);
                        }
                        return callbackDeleteIntentFromTheDomain(null);                        
                    })
                }
            ], (err, result) => {
                
                if (err){
                    return callbackDeleteIntentAndReferences(err);
                }
                return callbackDeleteIntentAndReferences(null);
            });
        }
    ], (err) => {

        if (err){
            return reply(err, null);
        }
        Async.series([
            Async.apply(IntentTools.updateEntitiesDomainTool, redis, { examples: []}, agentId, domainId, intent.examples),
            (callback) => {

                Async.parallel([
                    Async.apply(IntentTools.retrainModelTool, server, rasa, intent.agent, intent.domain, domainId),
                    Async.apply(IntentTools.retrainDomainRecognizerTool, server, redis, rasa, intent.agent, agentId)
                ], (err) => {
    
                    if (err){
                        return callback(err);
                    }
                    return callback(null);
                });
            }
        ], (err) => {
    
            if (err) {
                return reply(err);
            }
    
            return reply({ message: 'successful operation' }).code(200);
        });
    });
};
