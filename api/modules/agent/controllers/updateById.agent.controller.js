'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

const updateDataFunction = (redis, agentId, currentAgent, updateData, cb) => {

    const flatAgent = Flat(currentAgent);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatAgent[key] = flatUpdateData[key];
    });
    redis.hmset(`agent:${agentId}`, flatAgent, (err) => {

        if (err){
            const error = Boom.badImplementation('An error ocurred updating the agent data.');
            return cb(error);
        }
        return cb(null, Flat.unflatten(flatAgent));
    });
};

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const updateData = request.payload;
    let requiresRetrain = false;

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
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the agent ${agentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentAgent, cb) => {

            const requiresNameChanges = updateData.agentName && updateData.agentName !== currentAgent.agentName;
            if (requiresNameChanges){
                Async.waterfall([
                    (callback) => {

                        redis.zadd('agents', 'NX', agentId, updateData.agentName, (err, addResponse) => {

                            if (err){
                                const error = Boom.badImplementation(`An error ocurred adding the name ${currentAgent.agentName} to the agents list of agents`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest('An agent with this name already exists');
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        Async.parallel([
                            (callbackUpdateAgentDomains) => {

                                Async.waterfall([
                                    (callbackGetDomains) => {

                                        server.inject(`/agent/${agentId}/domain`, (res) => {

                                            if (res.statusCode !== 200){
                                                const error = Boom.create(res.statusCode, `An error ocurred getting the intents to update of the agent ${agentId}`);
                                                return callbackGetDomains(error, null);
                                            }
                                            return callbackGetDomains(null, res.result);
                                        });
                                    },
                                    (domains, callbackUpdateEachDomain) => {

                                        Async.map(domains, (domain, callbackMapOfDomain) => {

                                            Async.parallel([
                                                (callbackUpdateDomain) => {

                                                    domain.agent = updateData.agentName;

                                                    requiresRetrain = true;
                                                    redis.hmset(`domain:${domain.id}`, Flat(domain), (err, result) => {

                                                        if (err){
                                                            const error = Boom.badImplementation(`An error ocurred updating the domain ${domain.id} with the new values of the agent`);
                                                            return callbackUpdateDomain(error, null);
                                                        }
                                                        return callbackUpdateDomain(null);
                                                    });
                                                },
                                                (callbackUpdateDomainSons) => {

                                                    Async.waterfall([
                                                        (callbackGetIntents) => {

                                                            server.inject(`/domain/${domain.id}/intent`, (res) => {

                                                                if (res.statusCode !== 200){
                                                                    const error = Boom.create(res.statusCode, `An error ocurred getting the intents to update of the domain ${domainId}`);
                                                                    return callbackGetIntents(error, null);
                                                                }
                                                                return callbackGetIntents(null, res.result);
                                                            });
                                                        },
                                                        (intents, callbackUpdateIntentAndScenario) => {

                                                            Async.map(intents, (intent, callbackMapOfIntent) => {

                                                                requiresRetrain = true;
                                                                Async.parallel([
                                                                    (callbackUpdateIntent) => {

                                                                        intent.agent = updateData.agentName;

                                                                        redis.hmset(`intent:${intent.id}`, Flat(intent), (err, result) => {

                                                                            if (err){
                                                                                const error = Boom.badImplementation(`An error ocurred updating the intent ${intent.id} with the new values of the entity`);
                                                                                return callbackUpdateIntent(error, null);
                                                                            }
                                                                            return callbackUpdateIntent(null);
                                                                        });
                                                                    },
                                                                    (callbackUpdateScenario) => {

                                                                        const updatedValues = {
                                                                            agent: updateData.agentName
                                                                        };
                                                                        redis.hmset(`scenario:${intent.id}`, updatedValues, (err, result) => {

                                                                            if (err){
                                                                                const error = Boom.badImplementation(`An error ocurred updating the scenario of the intent ${intent.id} with the new values of the entity`);
                                                                                return callbackUpdateScenario(error, null);
                                                                            }
                                                                            return callbackUpdateScenario(null);
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
                                                                    return callbackUpdateIntentAndScenario(err);
                                                                }
                                                                return callbackUpdateIntentAndScenario(null);
                                                            });
                                                        }
                                                    ], (err, result) => {

                                                        if (err){
                                                            return callbackUpdateDomainSons(err);
                                                        }
                                                        return callbackUpdateDomainSons(null);
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
                                                return callbackUpdateEachDomain(err);
                                            }
                                            return callbackUpdateEachDomain(null);
                                        });
                                    }
                                ], (err, result) => {

                                    if (err){
                                        return callbackUpdateAgentDomains(err);
                                    }
                                    return callbackUpdateAgentDomains(null);
                                });
                            },
                            (callbackUpdateAgentEntities) => {

                                Async.waterfall([
                                    (callbackGetEntities) => {

                                        server.inject(`/agent/${agentId}/entity`, (res) => {

                                            if (res.statusCode !== 200){
                                                const error = Boom.create(res.statusCode, `An error ocurred getting the entities to update of the agent ${agentId}`);
                                                return callbackGetEntities(error, null);
                                            }
                                            return callbackGetEntities(null, res.result);
                                        });
                                    },
                                    (entities, callbackUpdateEachEntity) => {

                                        Async.map(entities, (entity, callbackMapOfEntity) => {

                                            entity.agent = updateData.agentName;

                                            requiresRetrain = true;
                                            redis.hmset(`entity:${entity.id}`, Flat(entity), (err, result) => {

                                                if (err){
                                                    const error = Boom.badImplementation(`An error ocurred updating the entity ${entity.entityName} with the new values of the agent`);
                                                    return callbackMapOfEntity(error, null);
                                                }
                                                return callbackMapOfEntity(null);
                                            });
                                        }, (err, result) => {

                                            if (err){
                                                return callbackUpdateEachEntity(err);
                                            }
                                            return callbackUpdateEachEntity(null);
                                        });
                                    }
                                ], (err, result) => {

                                    if (err){
                                        return callbackUpdateAgentEntities(err);
                                    }
                                    return callbackUpdateAgentEntities(null);
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
                                const error = Boom.badImplementation( `An error ocurred removing the name ${currentAgent.agentName} from the agents list of agents`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, agentId, currentAgent, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the agent data.');
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
                updateDataFunction(redis, agentId, currentAgent, updateData, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the agent data.');
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
        if (requiresRetrain){
            Async.waterfall([
                (callbackGetDomains) => {

                    server.inject(`/agent/${agentId}/domain`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, 'An error ocurred getting the domains of the agent to train them');
                            return callbackGetDomains(error, null);
                        }
                        return callbackGetDomains(null, res.result);
                    });
                },
                (domains, callbackTrainEachDomain) => {

                    Async.eachLimit(domains, 1, (domain, callbackMapOfDomain) => {

                        server.inject(`/domain/${domain.id}/train`, (res) => {

                            if (res.statusCode !== 200){
                                const error = Boom.create(res.statusCode, `An error ocurred training the domain ${domain.domainName}`);
                                return callbackMapOfDomain(error);
                            }
                            return callbackMapOfDomain(null);
                        });
                    }, (err) => {

                        if (err){
                            return callbackTrainEachDomain(err);
                        }
                        return callbackTrainEachDomain(null);
                    });
                }
            ], (errTraining) => {

                if (errTraining){
                    return reply(errTraining);
                }
                return reply(result);
            });
        }
        else {
            return reply(result);
        }
    });
};
