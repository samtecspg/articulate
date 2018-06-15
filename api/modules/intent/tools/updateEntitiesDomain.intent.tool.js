'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');

const extractEntities = (examples) => {

    //Only system entities have an extractor specified, so ignore sys entities
    const entities = _.compact(_.uniq(_.flatten(_.map(_.filter(_.flatten(_.map(examples, 'entities')), (entity) => {

        return !entity.extractor;
    }), 'entity'))));
    return entities;
};

const updateEntitiesDomain = (server, redis, intent, agentId, domainId, oldExamples, cb) => {

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
                                const error = Boom.badImplementation(`An error occurred retrieving the id of the entity ${entity}.`);
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
                                        const error = Boom.badImplementation(`An error occurred checking if the entity ${entityId} is being used by the domain ${domainId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`entityDomain:${entityId}`, domainId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error occurred adding the domain ${domainId} to the list of domains of entity ${entityId}`);
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
                                        const error = Boom.badImplementation(`An error occurred checking if the domain ${domainId} is using the entity ${entityId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`domainEntities:${domainId}`, entityId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error occurred adding the entity ${entityId} to the list of entities used by the domain ${domainId}`);
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
                                const error = Boom.badImplementation(`An error occurred retrieving the id of the entity ${entity}.`);
                                return cllbk(error);
                            }
                            return cllbk(null, entityId);
                        });
                    },
                    (entityId, cllbk) => {

                        server.inject(`/entity/${entityId}/intent`, (res) => {

                            if (res.result && res.result.statusCode && res.result.statusCode !== 200){
                                const error = Boom.badImplementation(`An error occurred checking if the entity ${entityId} is being used by other intents`);
                                return cllbk(error);
                            }
                            const domainsUsingEntity = _.map(res.result, 'domain');
                            if (domainsUsingEntity.indexOf(intent.domain) !== -1){
                                return cllbk(null);
                            }
                            Async.parallel([
                                (cllback) => {

                                    redis.sismember(`entityDomain:${entityId}`, domainId, (err, result) => {

                                        if (err){
                                            const error = Boom.badImplementation(`An error occurred checking if the entity ${entityId} is being used by the domain ${domainId}`);
                                            return cllback(error);
                                        }
                                        if (result){
                                            redis.srem(`entityDomain:${entityId}`, domainId, (saddErr, saddResult) => {

                                                if (saddErr){
                                                    const error = Boom.badImplementation(`An error occurred removing the domain ${domainId} from the list of domains of entity ${entityId}`);
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
                                            const error = Boom.badImplementation(`An error occurred checking if the domain ${domainId} is using the entity ${entityId}`);
                                            return cllback(error);
                                        }
                                        if (result){
                                            redis.srem(`domainEntities:${domainId}`, entityId, (saddErr, saddResult) => {

                                                if (saddErr){
                                                    const error = Boom.badImplementation(`An error occurred removing the entity ${entityId} from the list of entities used by the domain ${domainId}`);
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
                            ], (err) => {

                                if (err){
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        });
                    }
                ], (err) => {

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
