'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');

const updateKeywordsDomain = (server, redis, action, agentId, domainId, oldKeywords, cb) => {

    const usedKeywords = _.map(action.slots, 'keyword');
    let removedKeywords = null;
    if (oldKeywords){
        removedKeywords = _.difference(oldKeywords, usedKeywords);
    }

    Async.parallel([
        (callbackLinkKeywordsAndDomains) => {

            Async.map(usedKeywords, (keyword, callback) => {

                Async.waterfall([
                    (cllbk) => {

                        redis.zscore(`agentKeywords:${agentId}`, keyword, (err, keywordId) => {

                            if (err){
                                const error = Boom.badImplementation(`An error occurred retrieving the id of the keyword ${keyword}.`);
                                return cllbk(error);
                            }
                            return cllbk(null, keywordId);
                        });
                    },
                    (keywordId, cllbk) => {

                        Async.parallel([
                            (cllback) => {

                                redis.sismember(`keywordDomain:${keywordId}`, domainId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred checking if the keyword ${keywordId} is being used by the domain ${domainId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`keywordDomain:${keywordId}`, domainId, (saddErr) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error occurred adding the domain ${domainId} to the list of domains of keyword ${keywordId}`);
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

                                redis.sismember(`domainKeywords:${domainId}`, keywordId, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred checking if the domain ${domainId} is using the keyword ${keywordId}`);
                                        return cllback(error);
                                    }
                                    if (!result){
                                        redis.sadd(`domainKeywords:${domainId}`, keywordId, (saddErr, saddResult) => {

                                            if (saddErr){
                                                const error = Boom.badImplementation(`An error occurred adding the keyword ${keywordId} to the list of keywords used by the domain ${domainId}`);
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
                    return callbackLinkKeywordsAndDomains(err, null);
                }

                return callbackLinkKeywordsAndDomains(null);
            });
        },
        (callbackRemovedUnusedKeywords) => {

            Async.map(removedKeywords, (keyword, callback) => {

                Async.waterfall([
                    (cllbk) => {

                        redis.zscore(`agentKeywords:${agentId}`, keyword, (err, keywordId) => {

                            if (err){
                                const error = Boom.badImplementation(`An error occurred retrieving the id of the keyword ${keyword}.`);
                                return cllbk(error);
                            }
                            return cllbk(null, keywordId);
                        });
                    },
                    (keywordId, cllbk) => {

                        server.inject(`/keyword/${keywordId}/action`, (res) => {

                            if (res.result && res.result.statusCode && res.result.statusCode !== 200){
                                const error = Boom.badImplementation(`An error occurred checking if the keyword ${keywordId} is being used by other actions`);
                                return cllbk(error);
                            }
                            const domainsUsingKeyword = _.map(res.result, 'domain');
                            if (domainsUsingKeyword.indexOf(action.domain) !== -1){
                                return cllbk(null);
                            }
                            Async.parallel([
                                (cllback) => {

                                    redis.sismember(`keywordDomain:${keywordId}`, domainId, (err, result) => {

                                        if (err){
                                            const error = Boom.badImplementation(`An error occurred checking if the keyword ${keywordId} is being used by the domain ${domainId}`);
                                            return cllback(error);
                                        }
                                        if (result){
                                            redis.srem(`keywordDomain:${keywordId}`, domainId, (saddErr, saddResult) => {

                                                if (saddErr){
                                                    const error = Boom.badImplementation(`An error occurred removing the domain ${domainId} from the list of domains of keyword ${keywordId}`);
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

                                    redis.sismember(`domainKeywords:${domainId}`, keywordId, (err, result) => {

                                        if (err){
                                            const error = Boom.badImplementation(`An error occurred checking if the domain ${domainId} is using the keyword ${keywordId}`);
                                            return cllback(error);
                                        }
                                        if (result){
                                            redis.srem(`domainKeywords:${domainId}`, keywordId, (saddErr, saddResult) => {

                                                if (saddErr){
                                                    const error = Boom.badImplementation(`An error occurred removing the keyword ${keywordId} from the list of keywords used by the domain ${domainId}`);
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
                    return callbackRemovedUnusedKeywords(err, null);
                }

                return callbackRemovedUnusedKeywords(null);
            });
        }
    ], (err) => {

        if (err){
            return cb(err, null);
        }

        return cb(null);
    });

};

module.exports = updateKeywordsDomain;
