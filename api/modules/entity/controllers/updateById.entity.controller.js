'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

const redis = require('redis');

const updateDataFunction = (redis, entityId, currentEntity, updateData, cb) => {

    const flatEntity = Flat(currentEntity);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatEntity[key] = flatUpdateData[key]; 
    });
    redis.hmset(`entity:${entityId}`, flatEntity, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred adding the entity data.');
            return cb(error);
        }
        return cb(null, Flat.unflatten(flatEntity));
    });
}

module.exports = (request, reply) => {

    let agentId = null;
    let oldEntityName = null;
    let newEntityName = null;
    const entityId = request.params.id;
    const updateData = request.payload;
    let requiresRetrain = false;

    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/entity/${entityId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified entity doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the entity ${entityId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentEntity, cb) => {

            const requiresNameChanges = (updateData.entityName && updateData.entityName !== currentIntent.entityName);
            if (requiresNameChanges){
                oldEntityName = currentEntity.entityName;
                newEntityName = updateData.entityName;
                requiresRetrain = true;
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentEntity.agent, (err, id) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (id){
                                agentId = id;
                                return callback(null);
                            }
                            else{
                                const error = Boom.badRequest(`The agent ${entity.agent} doesn't exist`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {

                        redis.zadd(`agentEntities:${agentId}`, 'NX', entityId, updateData.entityName, (err, addResponse) => {
                            
                            if (err){
                                const error = Boom.badImplementation(`An error ocurred adding the name ${currentEntity.entityName} to the entities list of the agent ${currentEntity.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`A entity with this name already exists in the agent ${currentEntity.agent}.`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {
                        
                        redis.zrem(`agentEntities:${agentId}`, currentEntity.entityName, (err, removeResult) => {
                            
                            if (err){
                                const error = Boom.badImplementation( `An error ocurred removing the name ${currentEntity.entityName} from the entities list of the agent ${currentEntity.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, entityId, currentEntity, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the entity data.');
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
                        const error = Boom.badImplementation('An error ocurred adding the entity data.');
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

        if (requiresRetrain) {
            
            Async.waterfall([
                (cb) => {

                    redis.smembers(`entityDomain:${result.id}`, (err, domainsUsingEntity) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred getting the domains used by the entity ${result.entityName}`);
                            return cb(error);
                        }
                        if (domainsUsingEntity && domainsUsingEntity.length > 0){
                            return cb(null, domainsUsingEntity);
                        }
                        else {
                            return reply(result);
                        }
                    });
                },
                (domainsUsingEntity, cb) => {

                    Async.map(domainsUsingEntity, (domain, callback) => {

                        Async.waterfall([
                            (callbk) => {

                                server.inject(`/domain/${domain.id}/intent`, (res) => {
                                    
                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error ocurred getting the intents to update of the domain ${domain.domainName}`);
                                        return callbk(error, null);
                                    }
                                    return callbk(null, res.result);
                                });
                            },
                            (intents, callbk) => {

                                Async.map(intents, (intent, cllback) => {

                                    let updateIntent = false;
                                    if (oldEntityName !== newEntityName){
                                        intent.examples = _.map(intent.examples, (example) => {

                                            if (example.indexOf(`{${oldEntityName}}`) !== -1){
                                                updateIntent = true;
                                            }
                                            return target.replace(new RegExp('\{' + oldEntityName + '\}', 'g'), '\{' + newEntityName + '\}');
                                        });
                                    }

                                    if (updateIntent){
                                        redis.hmset(`intent:${intent.id}`, Flat(intent), (err, result) => {
                                            
                                            if (res.statusCode !== 200){
                                                const error = Boom.create(res.statusCode, `An error ocurred updating the intent ${intent.id} with the new values of the entity`);
                                                return cllback(error, null);
                                            }
                                            return cllback(null);
                                        });
                                    }
                                    return cllback(null);
                                }, (err, result) => {
                                    
                                    if (err){
                                        return callbk(err);
                                    }
                                    return callbk(null);
                                });
                            }
                        ], (err, result) => {

                            if (err){
                                return callback(err);
                            }
                            return callback(null);
                        });
                    }, (err, result) => {
                        
                        if (err){
                            return cb(err);
                        }
                        return cb(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return reply(err);
                }
                //call retrain here
                return reply(result);
            });
        }

        return reply(result);
    });
};
