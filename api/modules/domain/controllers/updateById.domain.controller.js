'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

const redis = require('redis');

const updateDataFunction = (redis, domainId, currentDomain, updateData, cb) => {

    const flatDomain = Flat(currentDomain);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatDomain[key] = flatUpdateData[key]; 
    });
    redis.hmset(`domain:${domainId}`, flatDomain, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred adding the domain data.');
            return cb(error);
        }
        return cb(null, Flat.unflatten(flatDomain));
    });
}

module.exports = (request, reply) => {

    let agentId = null;
    const domainId = request.params.id;
    const updateData = request.payload;
    const requiresRetrain = false;

    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/domain/${domainId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the domain ${domainId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentDomain, cb) => {

            const requiresNameChanges = (updateData.agent && updateData.agent !== currentIntent.agent) ||
                                        (updateData.domainName && updateData.domainName !== currentIntent.domainName)
            if (requiresNameChanges){
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentDomain.agent, (err, id) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (id){
                                agentId = id;
                                return callback(null);
                            }
                            else{
                                const error = Boom.badRequest(`The agent ${domain.agent} doesn't exist`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {

                        Async.waterfall([
                            (callbk) => {

                                server.inject(`/domain/${domainId}/intent`, (res) => {
                                    
                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error ocurred getting the intents to update of the domain ${domainId}`);
                                        return callbk(error, null);
                                    }
                                    return callbk(null, res.result);
                                });
                            },
                            (intents, callbk) => {

                                Async.map(intents, (intent, cllback) => {

                                    requiresRetrain = true;
                                    Async.parallel([
                                        (cbk) => {

                                            intent.agent = updateData.agent;
                                            intent.domain = updateData.domainName;

                                            redis.hmset(`intent:${intent.id}`, Flat(intent), (err, result) => {
                                                
                                                if (res.statusCode !== 200){
                                                    const error = Boom.create(res.statusCode, `An error ocurred updating the intent ${intent.id} with the new values of the entity`);
                                                    return cbk(error, null);
                                                }
                                                return cbk(null);
                                            });
                                        },
                                        (cbk) => {

                                            const updatedValues = {
                                                agent: updateData.agent,
                                                domain: updateData.domainName
                                            };
                                            redis.hmset(`scenario:${intent.id}`, Flat({updatedValues}), (err, result) => {
                                                
                                                if (res.statusCode !== 200){
                                                    const error = Boom.create(res.statusCode, `An error ocurred updating the scenario of the intent ${intent.id} with the new values of the entity`);
                                                    return cbk(error, null);
                                                }
                                                return cbk(null);
                                            });
                                        }
                                    ], (err, result) => {

                                        if (err){
                                            return cllback(err);
                                        }
                                        return cllback(null);
                                    })
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
                    },
                    (callback) => {

                        redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, updateData.domainName, (err, addResponse) => {
                            
                            if (err){
                                const error = Boom.badImplementation(`An error ocurred adding the name ${currentDomain.domainName} to the domains list of the agent ${currentDomain.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`A domain with this name already exists in the agent ${currentDomain.agent}.`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {
                        
                        redis.zrem(`agentDomains:${agentId}`, currentDomain.domainName, (err, removeResult) => {
                            
                            if (err){
                                const error = Boom.badImplementation( `An error ocurred removing the name ${currentDomain.domainName} from the domains list of the agent ${currentDomain.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, domainId, currentDomain, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the domain data.');
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
                updateDataFunction(redis, domainId, currentDomain, updateData, (err, result) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the domain data.');
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
        //call retrain here
        return reply(result);
    });
};
