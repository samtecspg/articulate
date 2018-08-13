'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const SayingTools = require('../tools');
const _ = require('lodash');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

const updateDataFunction = (redis, server, sayingId, currentSaying, updateData, agentId, domainId, cb) => {

    const oldKeywords = _.cloneDeep(currentSaying.keywords);
    if (updateData.keywords){
        currentSaying.keywords = updateData.keywords;
    }
    const keywords = _.sortBy(currentSaying.keywords, (keyword) => {

        return keyword.start;
    });
    currentSaying.keywords = keywords;

    //const oldActions = _.cloneDeep(currentSaying.actions);
    if (updateData.actions){
        currentSaying.actions = updateData.actions;
    }

    const flatSaying = Flat(currentSaying);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        if (key.indexOf('keyword') === -1 && key.indexOf('actions') === -1){
            flatSaying[key] = flatUpdateData[key];
        }
    });
    const resultSaying = Flat.unflatten(flatSaying);

    Async.series({
        temporalDelete: (callback) => {

            redis.del(`saying:${sayingId}`, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred temporarily removing the saying for the update.');
                    return callback(error);
                }
                return callback(null);
            });
        },
        sayingKeywordsUnlink: (callback) => {

            Async.eachSeries(oldKeywords, (keyword, nextKeyword) => {

                redis.zrem(`keywordSayings:${keyword.keywordId}`, currentSaying.sayingName, (err) => {

                    if (err){
                        const error = Boom.badImplementation( `An error occurred removing the saying ${sayingId} from the sayings list of the keyword ${keyword.keywordId}`);
                        return nextKeyword(error);
                    }
                    return nextKeyword(null);
                });
            }, callback);
        },
        sayingKeywordsLink: (callback) => {

            Async.eachSeries(resultSaying.keywords, (keyword, nextKeyword) => {

                //Only system keywords have an extractor specified, so ignore sys keywords
                if (keyword.extractor){
                    return nextKeyword(null);
                }
                redis.zadd(`keywordSayings:${keyword.keywordId}`, 'NX', sayingId, resultSaying.id, (err, addResponse) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred adding the saying to the keyword list.');
                        return nextKeyword(error);
                    }
                    return nextKeyword(null);
                });
            }, callback);
        },
        saying: (callback) => {

            redis.hmset(`saying:${sayingId}`, RemoveBlankArray(flatSaying), (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the saying data.');
                    return callback(error);
                }
                let requiresTraining = false;
                if (updateData.keywords){
                    requiresTraining = !_.isEqual(updateData.keywords, oldKeywords);
                }
                if (requiresTraining){
                    SayingTools.updateKeywordsDomainTool(server, redis, resultSaying, agentId, domainId, oldKeywords, (err) => {

                        if (err) {
                            return callback(err);
                        }
                        redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred updating the agent status.');
                                return callback(error);
                            }
                            redis.hmset(`domain:${domainId}`, { status: Status.outOfDate }, (err) => {

                                if (err){
                                    const error = Boom.badImplementation('An error occurred updating the domain status.');
                                    return callback(error);
                                }
                                return callback(null, resultSaying);
                            });
                        });
                    });
                }
                else {
                    return callback(null, resultSaying);
                }
            });
        }
    }, (err, result) => {

        if (err){
            return cb(err);
        }
        return cb(null, result.saying);
    });
};

module.exports = (request, reply) => {

    const sayingId = request.params.id;
    let agentId = null;
    let domainId = null;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/saying/${sayingId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified saying doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the saying ${sayingId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentSaying, cb) => {

            redis.zscore('agents', currentSaying.agent, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the agent.');
                    return cb(error);
                }
                if (id){
                    agentId = id;
                    return cb(null, currentSaying);
                }
                const error = Boom.badRequest(`The agent ${currentSaying.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentSaying, cb) => {

            redis.zscore(`agentDomains:${agentId}`, currentSaying.domain, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the domain.');
                    return cb(error);
                }
                if (id){
                    domainId = id;
                    return cb(null, currentSaying);
                }
                const error = Boom.badRequest(`The domain ${currentSaying.domain} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentSaying, cb) => {

            if (updateData.keywords){
                SayingTools.validateKeywordsTool(redis, agentId, updateData.keywords, (err) => {

                    if (err) {
                        return cb(err);
                    }
                    return cb(null, currentSaying);
                });
            }
            else {
                return cb(null, currentSaying);
            }
        },
        (currentSaying, cb) => {

            if (updateData.sayingName && updateData.sayingName !== currentSaying.sayingName){
                Async.waterfall([
                    (callback) => {

                        redis.zadd(`domainSayings:${domainId}`, 'NX', sayingId, sayingId, (err, addResponse) => {

                            if (err) {
                                const error = Boom.badImplementation(`An error occurred adding the name ${updateData.sayingId} to the sayings list of the domain ${currentSaying.domain}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A saying with the name ${updateData.sayingId} already exists in the domain ${currentSaying.domain}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zrem(`domainSayings:${domainId}`, currentSaying.id, (err) => {

                            if (err){
                                const error = Boom.badImplementation( `An error occurred removing the name ${currentSaying.sayingName} from the sayings list of the agent ${currentSaying.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, server, sayingId, currentSaying, updateData, agentId, domainId, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the saying data.');
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
                updateDataFunction(redis, server, sayingId, currentSaying, updateData, agentId, domainId, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the saying data.');
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
        return reply(Cast(result, 'saying'));
    });
};
