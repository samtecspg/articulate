'use strict';
const Async = require('async');
const Boom = require('boom');
const IntentTools = require('../tools');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    let intent;
    let agentId;
    let domainId;
    const server = request.server;
    const redis = server.app.redis;

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
        IntentTools.updateEntitiesDomainTool(server, redis, { domain: intent.domain, examples: [] }, agentId, domainId, intent.examples, (err) => {

            if (err) {
                return reply(err);
            }
            redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status.');
                    return reply(error);
                }
                redis.hmset(`domain:${domainId}`, { status: Status.outOfDate }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred updating the domain status.');
                        return reply(error);
                    }
                    return reply({ message: 'successful operation' }).code(200);
                });
            });
        });
    });
};
