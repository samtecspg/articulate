'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

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
};

module.exports = (request, reply) => {

    let agentId = null;
    const domainId = request.params.id;
    const updateData = request.payload;
    let requiresRetrain = false;

    const server = request.server;
    const redis = server.app.redis;

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

            const requiresNameChanges = updateData.domainName && updateData.domainName !== currentDomain.domainName;
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
                            const error = Boom.badRequest(`The agent ${domain.agent} doesn't exist`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, updateData.domainName, (err, addResponse) => {

                            if (err){
                                const error = Boom.badImplementation(`An error ocurred adding the name ${currentDomain.domainName} to the domains list of the agent ${currentDomain.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A domain with this name already exists in the agent ${currentDomain.agent}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        Async.waterfall([
                            (callbackGetIntents) => {

                                server.inject(`/domain/${currentDomain.id}/intent`, (res) => {

                                    if (res.statusCode !== 200){
                                        const error = Boom.create(res.statusCode, `An error ocurred getting the intents to update of the domain ${domain.id}`);
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

                                            intent.domain = updateData.domainName;

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
                                                domain: updateData.domainName
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
                                return callback(err);
                            }
                            return callback(null);
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
        if (requiresRetrain){
            //call retrain here
        }
        return reply(result);
    });
};
