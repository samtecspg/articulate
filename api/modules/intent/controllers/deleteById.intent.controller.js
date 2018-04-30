'use strict';
const Async = require('async');
const Boom = require('boom');
const IntentTools = require('../tools');
const DomainTools = require('../../domain/tools');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    let intent;
    let agent;
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
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the intent ${intentId}`);
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
                            const error = Boom.badImplementation(`An error occurred deleting the intent ${intentId}`);
                            return callbackDeleteIntent(error, null);
                        }
                        return callbackDeleteIntent(null);
                    });
                },
                (callbackDeleteScenario) => {

                    redis.del(`scenario:${intentId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the scenario ${intentId}`);
                            return callbackDeleteScenario(error, null);
                        }
                        return callbackDeleteScenario(null);
                    });
                },
                (callbackDeleteWebhook) => {

                    redis.del(`intentWebhook:${intentId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the webhook of the intent ${intentId}`);
                            return callbackDeleteWebhook(error, null);
                        }
                        return callbackDeleteWebhook(null);
                    });
                },
                (callbackDeleteIntentFromTheDomain) => {

                    Async.waterfall([
                        (callbackGetAgentId) => {

                            redis.zscore('agents', intent.agent, (err, score) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${intent.agent}`);
                                    return callbackGetAgentId(error);
                                }
                                agentId = score;
                                return callbackGetAgentId(null);
                            });
                        },
                        (callbackGetAgentData) => {

                            server.inject(`/agent/${agentId}`, (res) => {

                                if (res.statusCode !== 200){
                                    if (res.statusCode === 400){
                                        const errorNotFound = Boom.notFound(res.result.message);
                                        return callbackGetAgentData(errorNotFound);
                                    }
                                    const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                                    return callbackGetAgentData(error, null);
                                }
                                agent = res.result;
                                return callbackGetAgentData(null);
                            });
                        },
                        (callbackGetDomain) => {

                            redis.zscore(`agentDomains:${agentId}`, intent.domain, (err, score) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the domain ${intent.domain}`);
                                    return callbackGetDomain(error);
                                }
                                domainId = score;
                                return callbackGetDomain(null);
                            });
                        },
                        (callbackRemoveFromDomainsList) => {

                            redis.zrem(`domainIntents:${domainId}`, intent.intentName, (err, removeResult) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the intent ${intentId} from the intents list of the domain ${domainId}`);
                                    return callbackRemoveFromDomainsList(error);
                                }
                                return callbackRemoveFromDomainsList(null);
                            });
                        },
                        (callbackRemoveFromEntitiesList) => {

                            Async.eachSeries(intent.examples, (example, nextIntent) => {

                                Async.eachSeries(example.entities, (entity, nextEntity) => {

                                    redis.zrem(`entityIntents:${entity.entityId}`, intent.intentName, (err, addResponse) => {

                                        if (err){
                                            const error = Boom.badImplementation( `An error occurred removing the intent ${intentId} from the intents list of the entity ${entity.entityId}`);
                                            return nextEntity(error);
                                        }
                                        return nextEntity(null);
                                    });
                                }, nextIntent);
                            }, callbackRemoveFromEntitiesList);
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteIntentFromTheDomain(err);
                        }
                        return callbackDeleteIntentFromTheDomain(null);
                    });
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
            Async.apply(IntentTools.updateEntitiesDomainTool, server, redis, { domain: intent.domain, examples: [] }, agentId, domainId, intent.examples),
            (callback) => {

                Async.parallel([
                    Async.apply(DomainTools.retrainModelTool, server, rasa, agent.language, intent.agent, intent.domain, domainId),
                    Async.apply(DomainTools.retrainDomainRecognizerTool, server, redis, rasa, agent.language, intent.agent, agentId)
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
