'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');

const extractEntities = (examples) => {

    const entities = _.uniq(_.compact(_.flatten(_.map(examples, (example) => {

        const usedEntitiesByExample = [];
        const entityPattern = /\{(.+?)\}/g;
        let match;
        while ((match = entityPattern.exec(example)) !== null){
            usedEntitiesByExample.push(match[1]);
        }
        return usedEntitiesByExample;
    }))));
    return entities;
};

const updateEntitiesDomain = (redis, intent, agentId, domainId, oldExamples, cb) => {

    const usedEntities = extractEntities(intent.examples);
    let oldEntities = null;
    let removedEntities = null;
    if (oldExamples){
        oldEntities = extractEntities(oldExamples);
        removedEntities = _.difference(oldEntities, usedEntities);
    }

    Async.parallel([
        (callbackLinkEntitiesAndDomains) => {

            Async.map(usedEntities, (entity, callback) => {

                Async.waterfall([
                    (cllbk) => {

                        redis.zscore(`agentEntities:${agentId}`, entity, (err, entityId) => {

                            if (err){
                                const error = Boom.badImplementation(`An error ocurred retrieving the id of the entity ${entity}.`);
                                return cllbk(error);
                            }
                            return cllbk(null, entityId);
                        });
                    },
                    (entityId, cllbk) => {

                        Async.parallel([
                            (cllback) => {

                                redis.sismember(`entityDomain:${entityId}`, domainId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error ocurred checking if the entity ${entityId} is being used by the domain ${domainId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`entityDomain:${entityId}`, domainId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error ocurred adding the domain ${domainId} to the list of domains of entity ${entityId}`);
                                                return cllback(error);
                                            }
                                            return cllback(null);
                                        });
                                    }
                                    else {
                                        return cllback(null);
                                    }
                                });
                            },
                            (cllback) => {

                                redis.sismember(`domainEntities:${domainId}`, entityId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error ocurred checking if the domain ${domainId} is using the entity ${entityId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`domainEntities:${domainId}`, entityId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error ocurred adding the entity ${entityId} to the list of entities used by the domain ${domainId}`);
                                                return cllback(error);
                                            }
                                            return cllback(null);
                                        });
                                    }
                                    else {
                                        return cllback(null);
                                    }
                                });
                            }
                        ], (err, result) => {

                            if (err){
                                return cllbk(err);
                            }
                            return cllbk(null);
                        });
                    }
                ], (err, result) => {

                    if (err){
                        return callback(err);
                    }
                    return callback(null);
                });
            }, (err) => {

                if (err){
                    return callbackLinkEntitiesAndDomains(err, null);
                }

                return callbackLinkEntitiesAndDomains(null);
            });
        },
        (callbackRemovedUnusedEntities) => {

            Async.map(removedEntities, (entity, callback) => {

                Async.waterfall([
                    (cllbk) => {

                        redis.zscore(`agentEntities:${agentId}`, entity, (err, entityId) => {

                            if (err){
                                const error = Boom.badImplementation(`An error ocurred retrieving the id of the entity ${entity}.`);
                                return cllbk(error);
                            }
                            return cllbk(null, entityId);
                        });
                    },
                    (entityId, cllbk) => {

                        Async.parallel([
                            (cllback) => {

                                redis.sismember(`entityDomain:${entityId}`, domainId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error ocurred checking if the entity ${entityId} is being used by the domain ${domainId}`);
                                        return cllback(error);
                                    }
                                    if (result){
                                        redis.srem(`entityDomain:${entityId}`, domainId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error ocurred removing the domain ${domainId} from the list of domains of entity ${entityId}`);
                                                return cllback(error);
                                            }
                                            return cllback(null);
                                        });
                                    }
                                    else {
                                        return cllback(null);
                                    }
                                });
                            },
                            (cllback) => {

                                redis.sismember(`domainEntities:${domainId}`, entityId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error ocurred checking if the domain ${domainId} is using the entity ${entityId}`);
                                        return cllback(error);
                                    }
                                    if (result){
                                        redis.srem(`domainEntities:${domainId}`, entityId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error ocurred removing the entity ${entityId} from the list of entities used by the domain ${domainId}`);
                                                return cllback(error);
                                            }
                                            return cllback(null);
                                        });
                                    }
                                    else {
                                        return cllback(null);
                                    }
                                });
                            }
                        ], (err, result) => {

                            if (err){
                                return cllbk(err);
                            }
                            return cllbk(null);
                        });
                    }
                ], (err, result) => {

                    if (err){
                        return callback(err);
                    }
                    return callback(null);
                });
            }, (err) => {

                if (err){
                    return callbackRemovedUnusedEntities(err, null);
                }

                return callbackRemovedUnusedEntities(null);
            });
        }
    ], (err) => {

        if (err){
            return cb(err, null);
        }

        return cb(null);
    });

};

module.exports = updateEntitiesDomain;
