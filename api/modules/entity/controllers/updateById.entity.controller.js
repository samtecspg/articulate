'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('flat');
const _ = require('lodash');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, entityId, currentEntity, updateData, cb) => {

    if (updateData.examples){
        currentEntity.examples = updateData.examples;
    }
    const flatEntity = Flat(currentEntity);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatEntity[key] = flatUpdateData[key];
    });
    if (flatEntity.regex === null){
        flatEntity.regex = '';
    }
    redis.del(`entity:${entityId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporaly removing the entity for the update.');
            return cb(error);
        }
        redis.hmset(`entity:${entityId}`, RemoveBlankArray(flatEntity), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the entity data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatEntity));
        });
    });
};

module.exports = (request, reply) => {

    let agentId = null;
    let oldEntityName = null;
    let newEntityName = null;
    const entityId = request.params.id;
    const updateData = request.payload;
    let requiresRetrain = false;

    const server = request.server;
    const redis = server.app.redis;

    if (updateData.entityName && updateData.entityName.startsWith('sys.')){
        const error = Boom.badRequest('\'sys.\' is a reserved prefix for system entities. Please use another entity name');
        return reply(error, null);
    }
    Async.waterfall([
        (cb) => {

            server.inject(`/entity/${entityId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified entity doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the entity ${entityId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentEntity, cb) => {

            const requiresNameChanges = (updateData.entityName && updateData.entityName !== currentEntity.entityName);
            if (requiresNameChanges){
                oldEntityName = currentEntity.entityName;
                newEntityName = updateData.entityName;
                requiresRetrain = true;
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentEntity.agent, (err, id) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (id){
                                agentId = id;
                                return callback(null);
                            }
                            const error = Boom.badRequest(`The agent ${currentEntity.agent} doesn't exist`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zadd(`agentEntities:${agentId}`, 'NX', entityId, updateData.entityName, (err, addResponse) => {

                            if (err){
                                const error = Boom.badImplementation(`An error occurred adding the name ${currentEntity.entityName} to the entities list of the agent ${currentEntity.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A entity with this name already exists in the agent ${currentEntity.agent}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zrem(`agentEntities:${agentId}`, currentEntity.entityName, (err, removeResult) => {

                            if (err){
                                const error = Boom.badImplementation( `An error occurred removing the name ${currentEntity.entityName} from the entities list of the agent ${currentEntity.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, entityId, currentEntity, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the entity data.');
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
                if (updateData.examples){
                    requiresRetrain = true;
                    oldEntityName = currentEntity.entityName;
                    newEntityName = currentEntity.entityName;
                }
                updateDataFunction(redis, entityId, currentEntity, updateData, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the entity data.');
                        return cb(error);
                    }
                    return cb(null, result);
                });
            }
        }
    ], (err, updatedEntity) => {

        if (err){
            return reply(err, null);
        }

        if (requiresRetrain) {

            Async.waterfall([
                (callbackGetDomainsUsingEntity) => {

                    redis.smembers(`entityDomain:${updatedEntity.id}`, (err, domainsUsingEntity) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred getting the domains used by the entity ${updatedEntity.entityName}`);
                            return callbackGetDomainsUsingEntity(error);
                        }
                        if (domainsUsingEntity && domainsUsingEntity.length > 0){
                            return callbackGetDomainsUsingEntity(null, domainsUsingEntity);
                        }
                        return reply(updatedEntity);
                    });
                },
                (domainsUsingEntity, callbackUpdateEachDomainIntents) => {

                    Async.map(domainsUsingEntity, (domain, callbackMapOfDomains) => {

                        Async.waterfall([
                            (callbackGetIntentsOfDomain) => {

                                server.inject(`/domain/${domain}/intent`, (res) => {

                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error occurred getting the intents to update of the domain ${domain}`);
                                        return callbackGetIntentsOfDomain(error, null);
                                    }
                                    return callbackGetIntentsOfDomain(null, res.result);
                                });
                            },
                            (intents, callbackUpdateIntentsAndScenarios) => {

                                Async.map(intents, (intent, callbackMapOfIntent) => {

                                    Async.parallel([
                                        (callbackUpdateIntent) => {

                                            let updateIntent = false;
                                            if (oldEntityName !== newEntityName){
                                                intent.examples = _.map(intent.examples, (example) => {

                                                    if (example.indexOf(`{${oldEntityName}}`) !== -1){
                                                        updateIntent = true;
                                                    }
                                                    return example.replace(new RegExp('\{' + oldEntityName + '\}', 'g'), '\{' + newEntityName + '\}');
                                                });
                                            }

                                            if (updateIntent){
                                                redis.hmset(`intent:${intent.id}`, RemoveBlankArray(Flat(intent)), (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred updating the intent ${intent.id} with the new values of the entity`);
                                                        return callbackUpdateIntent(error, null);
                                                    }
                                                    return callbackUpdateIntent(null);
                                                });
                                            }
                                            else {
                                                return callbackUpdateIntent(null);
                                            }
                                        },
                                        (callbackUpdateScenario) => {

                                            Async.waterfall([
                                                (callbackGetScenario) => {

                                                    server.inject(`/scenario/${intent.id}`, (res) => {

                                                        if (res.statusCode !== 200){
                                                            if (res.statusCode === 404){
                                                                return callbackGetScenario(null, null);
                                                            }
                                                            const error = Boom.create(res.statusCode, `An error occurred getting the data of the scenario ${intent.id}`);
                                                            return callbackGetScenario(error, null);
                                                        }
                                                        return callbackGetScenario(null, res.result);
                                                    });
                                                },
                                                (currentScenario, callbackUpdateScenarioSlots) => {

                                                    if (currentScenario){
                                                        let updateScenario = false;
                                                        if (oldEntityName !== newEntityName){
                                                            currentScenario.slots = _.map(currentScenario.slots, (slot) => {

                                                                if (slot.entity === oldEntityName){
                                                                    updateScenario = true;
                                                                    slot.entity = newEntityName;
                                                                }
                                                                return slot;
                                                            });
                                                        }

                                                        if (updateScenario){
                                                            redis.hmset(`scenario:${intent.id}`, RemoveBlankArray(Flat(currentScenario)), (err, result) => {

                                                                if (err){
                                                                    const error = Boom.badImplementation(`An error occurred updating the scenario ${intent.id} with the new values of the entity`);
                                                                    return callbackUpdateScenarioSlots(error, null);
                                                                }
                                                                return callbackUpdateScenarioSlots(null);
                                                            });
                                                        }
                                                        else {
                                                            return callbackUpdateScenarioSlots(null);
                                                        }
                                                    }
                                                    else {
                                                        return callbackUpdateScenarioSlots(null);
                                                    }
                                                }
                                            ], (err, result) => {

                                                if (err){
                                                    return callbackUpdateScenario(err, null);
                                                }
                                                return callbackUpdateScenario(result);
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
                                        return callbackUpdateIntentsAndScenarios(err);
                                    }
                                    return callbackUpdateIntentsAndScenarios(null);
                                });
                            },
                            (callbackRetrainDomains) => {

                                server.inject(`/domain/${domain}/train`, (res) => {

                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error occurred training the domain ${domain}`);
                                        return callbackMapOfDomains(error);
                                    }
                                    return callbackMapOfDomains(null);
                                });
                            }
                        ], (err) => {

                            if (err){
                                return callbackMapOfDomains(err);
                            }
                            return callbackMapOfDomains(null);
                        });
                    }, (err, result) => {

                        if (err){
                            return callbackUpdateEachDomainIntents(err);
                        }
                        return callbackUpdateEachDomainIntents(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return reply(err);
                }
                return reply(Cast(updatedEntity, 'entity'));
            });
        }
        else {
            return reply(Cast(updatedEntity, 'entity'));
        }
    });
};
