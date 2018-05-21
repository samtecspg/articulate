'use strict';
const Async = require('async');
const Boom = require('boom');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    const domainId = request.params.id;
    let domain;
    const server = request.server;
    const redis = server.app.redis;
    let requiresRetrain = false;
    let domainAgentId = null;

    Async.waterfall([
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domainId}`);
                    return cb(error, null);
                }
                domain = res.result;
                return cb(null);
            });
        },
        (callbackDeleteDomainSons) => {

            Async.waterfall([
                (callbackGetIntents) => {

                    server.inject(`/domain/${domain.id}/intent`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error occurred getting the intents to delete of the domain ${domainId}`);
                            return callbackGetIntents(error, null);
                        }
                        requiresRetrain = res.result.intents.length > 0;
                        return callbackGetIntents(null, res.result.intents);
                    });
                },
                (intents, callbackDeleteIntentAndScenario) => {

                    Async.map(intents, (intent, callbackMapOfIntent) => {

                        Async.parallel([
                            (callbackDeleteIntent) => {

                                redis.del(`intent:${intent.id}`, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred deleting the intent ${intent.id} linked with the domain ${domainId}`);
                                        return callbackDeleteIntent(error, null);
                                    }
                                    return callbackDeleteIntent(null);
                                });
                            },
                            (callbackDeleteScenario) => {

                                redis.del(`scenario:${intent.id}`, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred deleting the scenario of the intent ${intent.id} linked with the domain ${domainId}`);
                                        return callbackDeleteScenario(error, null);
                                    }
                                    return callbackDeleteScenario(null);
                                });
                            }
                        ], (err, result) => {

                            if (err){
                                return callbackMapOfIntent(err);
                            }
                            return callbackMapOfIntent(null);
                        });
                    }, (err, result) => {

                        if (err){
                            return callbackDeleteIntentAndScenario(err);
                        }
                        return callbackDeleteIntentAndScenario(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return callbackDeleteDomainSons(err);
                }
                return callbackDeleteDomainSons(null);
            });
        },
        (callbackDeleteDomainAndReferences) => {

            Async.parallel([
                (callbackDeleteDomain) => {

                    redis.del(`domain:${domainId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the domain ${domainId} from the domain ${domainId}`);
                            return callbackDeleteDomain(error, null);
                        }
                        return callbackDeleteDomain(null);
                    });
                },
                (callbackDeleteDomainIntentsList) => {

                    redis.del(`domainIntents:${domainId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the list of intents for domain ${domainId}`);
                            return callbackDeleteDomainIntentsList(error, null);
                        }
                        return callbackDeleteDomainIntentsList(null);
                    });
                },
                (callbackDeleteDomainEntitiesListAndRemoveLink) => {

                    Async.waterfall([
                        (callbackDeleteDomainFromEntities) => {

                            Async.waterfall([
                                (callbackGetEntitiesInDomain) => {

                                    redis.smembers(`domainEntities:${domainId}`, (err, entities) => {

                                        if (err){
                                            const error = Boom.badImplementation(`An error occurred getting the entities used by the domain ${domainId}`);
                                            return callbackGetEntitiesInDomain(error);
                                        }
                                        return callbackGetEntitiesInDomain(null, entities);
                                    });
                                },
                                (entities, callbackRemoveLinkForEachEntity) => {

                                    Async.map(entities, (entity, callbackMapOfEntity) => {

                                        redis.srem(`entityDomain:${entity}`, domainId, (err, removeResult) => {

                                            if (err){
                                                const error = Boom.badImplementation( `An error occurred removing the domain ${domainId} from the list of domains using the entity ${entity.id}`);
                                                return callbackMapOfEntity(error);
                                            }
                                            return callbackMapOfEntity(null);
                                        });
                                    }, (err, result) => {

                                        if (err){
                                            return callbackRemoveLinkForEachEntity(err);
                                        }
                                        return callbackRemoveLinkForEachEntity(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteDomainFromEntities(err);
                                }
                                return callbackDeleteDomainFromEntities(null);
                            });
                        },
                        (callbackDeleteDomainEntitiesList) => {

                            redis.del(`domainEntities:${domainId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the list of entities used by the domain ${domainId}`);
                                    return callbackDeleteDomainEntitiesList(error, null);
                                }
                                return callbackDeleteDomainEntitiesList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteDomainEntitiesListAndRemoveLink(err);
                        }
                        return callbackDeleteDomainEntitiesListAndRemoveLink(null);
                    });
                },
                (callbackDeleteDomainFromTheAgent) => {

                    Async.waterfall([
                        (callbackGetAgent) => {

                            redis.zscore('agents', domain.agent, (err, agentId) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${domain.agent}`);
                                    return callbackGetAgent(error);
                                }
                                domainAgentId = agentId;
                                return callbackGetAgent(null, agentId);
                            });
                        },
                        (agentId, callbackRemoveFromAgentsList) => {

                            redis.zrem(`agentDomains:${agentId}`, domain.domainName, (err, removeResult) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the domain ${domainId} from the domains list of the agent ${agentId}`);
                                    return callbackRemoveFromAgentsList(error);
                                }
                                return callbackRemoveFromAgentsList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteDomainFromTheAgent(err);
                        }
                        return callbackDeleteDomainFromTheAgent(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return callbackDeleteDomainAndReferences(err);
                }
                return callbackDeleteDomainAndReferences(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        if (requiresRetrain){
            redis.hmset(`agent:${domainAgentId}`, { status: Status.outOfDate }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status.');
                    return reply(error);
                }
                return reply({ message: 'successful operation' }).code(200);
            });
        }
        else {
            return reply({ message: 'successful operation' }).code(200);
        }
    });
};
