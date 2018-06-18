'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified agent doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the agent ${agentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentAgent, cb) => {

            Async.waterfall([
                (callback) => {

                    Async.parallel([
                        (callbackDeleteAgentDomains) => {

                            Async.waterfall([
                                (callbackGetDomains) => {

                                    server.inject(`/agent/${agentId}/domain`, (res) => {

                                        if (res.statusCode !== 200){
                                            const error = Boom.create(res.statusCode, `An error occurred getting the domains to delete from the agent ${agentId}`);
                                            return callbackGetDomains(error, null);
                                        }
                                        return callbackGetDomains(null, res.result.domains);
                                    });
                                },
                                (domains, callbackDeleteEachDomain) => {

                                    Async.map(domains, (domain, callbackMapOfDomain) => {

                                        Async.waterfall([
                                            (callbackDeleteDomainSons) => {

                                                Async.waterfall([
                                                    (callbackGetIntents) => {

                                                        server.inject(`/domain/${domain.id}/intent`, (res) => {

                                                            if (res.statusCode !== 200){
                                                                const error = Boom.create(res.statusCode, `An error occurred getting the intents to delete of the domain ${domain.domainName}`);
                                                                return callbackGetIntents(error, null);
                                                            }
                                                            return callbackGetIntents(null, res.result.intents);
                                                        });
                                                    },
                                                    (intents, callbackDeleteIntentAndScenario) => {

                                                        Async.map(intents, (intent, callbackMapOfIntent) => {

                                                            Async.parallel([
                                                                (callbackDeleteIntent) => {

                                                                    redis.del(`intent:${intent.id}`, (err, result) => {

                                                                        if (err){
                                                                            const error = Boom.badImplementation(`An error occurred deleting the intent ${intent.id} linked with the agent ${agentId}`);
                                                                            return callbackDeleteIntent(error, null);
                                                                        }
                                                                        return callbackDeleteIntent(null);
                                                                    });
                                                                },
                                                                (callbackDeleteScenario) => {

                                                                    redis.del(`scenario:${intent.id}`, (err, result) => {

                                                                        if (err){
                                                                            const error = Boom.badImplementation(`An error occurred deleting the scenario of the intent ${intent.id} linked with the agent ${agentId}`);
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

                                                        redis.del(`domain:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the domain ${domain.id} from the agent ${agentId}`);
                                                                return callbackDeleteDomain(error, null);
                                                            }
                                                            return callbackDeleteDomain(null);
                                                        });
                                                    },
                                                    (callbackDeleteDomainIntentsList) => {

                                                        redis.del(`domainIntents:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the list of intents for domain ${domain.id}`);
                                                                return callbackDeleteDomainIntentsList(error, null);
                                                            }
                                                            return callbackDeleteDomainIntentsList(null);
                                                        });
                                                    },
                                                    (callbackDeleteDomainEntitiesList) => {

                                                        redis.del(`domainEntities:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the list of entities for domain ${domain.id}`);
                                                                return callbackDeleteDomainEntitiesList(error, null);
                                                            }
                                                            return callbackDeleteDomainEntitiesList(null);
                                                        });
                                                    }
                                                ], (err, result) => {

                                                    if (err){
                                                        return callbackDeleteDomainAndReferences(err);
                                                    }
                                                    return callbackDeleteDomainAndReferences(null, result);
                                                });
                                            }
                                        ], (err, result) => {

                                            if (err){
                                                return callbackMapOfDomain(err);
                                            }
                                            return callbackMapOfDomain(null);
                                        });
                                    }, (err, result) => {

                                        if (err){
                                            return callbackDeleteEachDomain(err);
                                        }
                                        return callbackDeleteEachDomain(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteAgentDomains(err);
                                }
                                return callbackDeleteAgentDomains(null);
                            });
                        },
                        (callbackDeleteAgentEntities) => {

                            Async.waterfall([
                                (callbackGetEntities) => {

                                    server.inject(`/agent/${agentId}/entity`, (res) => {

                                        if (res.statusCode !== 200){
                                            const error = Boom.create(res.statusCode, `An error occurred getting the entities to delete of the agent ${agentId}`);
                                            return callbackGetEntities(error, null);
                                        }
                                        return callbackGetEntities(null, res.result.entities);
                                    });
                                },
                                (entities, callbackDeleteEachEntity) => {

                                    Async.map(entities, (entity, callbackMapOfEntity) => {

                                        Async.parallel([
                                            (callbackDeleteEntity) => {

                                                redis.del(`entity:${entity.id}`, (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred deleting the entity ${entity.id} linked with the agent ${agentId}`);
                                                        return callbackDeleteEntity(error, null);
                                                    }
                                                    return callbackDeleteEntity(null);
                                                });
                                            },
                                            (callbackDeleteEntitiesDomainList) => {

                                                redis.del(`entityDomain:${entity.id}`, (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred deleting the list of domains for entity ${entity.id}`);
                                                        return callbackDeleteEntitiesDomainList(error, null);
                                                    }
                                                    return callbackDeleteEntitiesDomainList(null);
                                                });
                                            }
                                        ], (err, result) => {

                                            if (err){
                                                return callbackMapOfEntity(err);
                                            }
                                            return callbackMapOfEntity(null, result);
                                        });
                                    }, (err, result) => {

                                        if (err){
                                            return callbackDeleteEachEntity(err);
                                        }
                                        return callbackDeleteEachEntity(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteAgentEntities(err);
                                }
                                return callbackDeleteAgentEntities(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                },
                (callback) => {

                    redis.zrem('agents', currentAgent.agentName, (err, removeResult) => {

                        if (err){
                            const error = Boom.badImplementation( `An error occurred removing the name ${currentAgent.agentName} from the agents list of the agents`);
                            return callback(error);
                        }
                        return callback(null);
                    });
                },
                (callback) => {

                    Async.parallel([
                        (callbackDeleteAgentSet) => {

                            redis.del(`agent:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentSet(error, null);
                                }
                                return callbackDeleteAgentSet(null);
                            });
                        },
                        (callbackDeleteDomainRecognitionLog) => {

                            redis.del(`agentDomainRecognizer:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation('An error occurred deleting the agent domain recognition log');
                                    return callbackDeleteDomainRecognitionLog(error, null);
                                }
                                return callbackDeleteDomainRecognitionLog(null);
                            });
                        },
                        (callbackDeleteAgentDomainsList) => {

                            redis.del(`agentDomains:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentDomainsList(error, null);
                                }
                                return callbackDeleteAgentDomainsList(null);
                            });
                        },
                        (callbackDeleteAgentEntitiesList) => {

                            redis.del(`agentEntities:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentEntitiesList(error, null);
                                }
                                return callbackDeleteAgentEntitiesList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return cb(err);
                }
                return cb(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
