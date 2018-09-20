'use strict';
const Async = require('async');
const Boom = require('boom');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    const domainId = request.params.id;
    let domain;
    const server = request.server;
    const redis = server.app.redis;
    let requiresRetrain = false;
    let domainAgentId = null;

    Async.waterfall([
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domainId}`);
                    return cb(error, null);
                }
                domain = res.result;
                return cb(null);
            });
        },
        (callbackDeleteDomainSons) => {

            Async.waterfall([
                (callbackGetSayings) => {

                    server.inject(`/domain/${domain.id}/saying`, (res) => {

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error occurred getting the sayings to delete of the domain ${domainId}`);
                            return callbackGetSayings(error, null);
                        }
                        requiresRetrain = res.result.sayings.length > 0;
                        return callbackGetSayings(null, res.result.sayings);
                    });
                },
                (sayings, callbackDeleteSayingAndScenario) => {

                    Async.map(sayings, (saying, callbackMapOfSaying) => {

                        Async.parallel([
                            (callbackDeleteSaying) => {

                                redis.del(`saying:${saying.id}`, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred deleting the saying ${saying.id} linked with the domain ${domainId}`);
                                        return callbackDeleteSaying(error, null);
                                    }
                                    return callbackDeleteSaying(null);
                                });
                            },
                            (callbackDeleteScenario) => {

                                redis.del(`scenario:${saying.id}`, (err, result) => {

                                    if (err){
                                        const error = Boom.badImplementation(`An error occurred deleting the scenario of the saying ${saying.id} linked with the domain ${domainId}`);
                                        return callbackDeleteScenario(error, null);
                                    }
                                    return callbackDeleteScenario(null);
                                });
                            }
                        ], (err, result) => {

                            if (err){
                                return callbackMapOfSaying(err);
                            }
                            return callbackMapOfSaying(null);
                        });
                    }, (err, result) => {

                        if (err){
                            return callbackDeleteSayingAndScenario(err);
                        }
                        return callbackDeleteSayingAndScenario(null);
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

                    redis.del(`domain:${domainId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the domain ${domainId} from the domain ${domainId}`);
                            return callbackDeleteDomain(error, null);
                        }
                        return callbackDeleteDomain(null);
                    });
                },
                (callbackDeleteDomainSayingsList) => {

                    redis.del(`domainSayings:${domainId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the list of sayings for domain ${domainId}`);
                            return callbackDeleteDomainSayingsList(error, null);
                        }
                        return callbackDeleteDomainSayingsList(null);
                    });
                },
                (callbackDeleteDomainKeywordsListAndRemoveLink) => {

                    Async.waterfall([
                        (callbackDeleteDomainFromKeywords) => {

                            Async.waterfall([
                                (callbackGetKeywordsInDomain) => {

                                    redis.smembers(`domainKeywords:${domainId}`, (err, keywords) => {

                                        if (err){
                                            const error = Boom.badImplementation(`An error occurred getting the keywords used by the domain ${domainId}`);
                                            return callbackGetKeywordsInDomain(error);
                                        }
                                        return callbackGetKeywordsInDomain(null, keywords);
                                    });
                                },
                                (keywords, callbackRemoveLinkForEachKeyword) => {

                                    Async.map(keywords, (keyword, callbackMapOfKeyword) => {

                                        redis.srem(`keywordDomain:${keyword}`, domainId, (err, removeResult) => {

                                            if (err){
                                                const error = Boom.badImplementation( `An error occurred removing the domain ${domainId} from the list of domains using the keyword ${keyword.id}`);
                                                return callbackMapOfKeyword(error);
                                            }
                                            return callbackMapOfKeyword(null);
                                        });
                                    }, (err, result) => {

                                        if (err){
                                            return callbackRemoveLinkForEachKeyword(err);
                                        }
                                        return callbackRemoveLinkForEachKeyword(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteDomainFromKeywords(err);
                                }
                                return callbackDeleteDomainFromKeywords(null);
                            });
                        },
                        (callbackDeleteDomainKeywordsList) => {

                            redis.del(`domainKeywords:${domainId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the list of keywords used by the domain ${domainId}`);
                                    return callbackDeleteDomainKeywordsList(error, null);
                                }
                                return callbackDeleteDomainKeywordsList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteDomainKeywordsListAndRemoveLink(err);
                        }
                        return callbackDeleteDomainKeywordsListAndRemoveLink(null);
                    });
                },
                (callbackDeleteDomainFromTheAgent) => {

                    Async.waterfall([
                        (callbackGetAgent) => {

                            redis.zscore('agents', domain.agent, (err, agentId) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${domain.agent}`);
                                    return callbackGetAgent(error);
                                }
                                domainAgentId = agentId;
                                return callbackGetAgent(null, agentId);
                            });
                        },
                        (agentId, callbackRemoveFromAgentsList) => {

                            redis.zrem(`agentDomains:${agentId}`, domain.domainName, (err, removeResult) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the domain ${domainId} from the domains list of the agent ${agentId}`);
                                    return callbackRemoveFromAgentsList(error);
                                }
                                return callbackRemoveFromAgentsList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteDomainFromTheAgent(err);
                        }
                        return callbackDeleteDomainFromTheAgent(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return callbackDeleteDomainAndReferences(err);
                }
                return callbackDeleteDomainAndReferences(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        if (requiresRetrain){
            redis.hmset(`agent:${domainAgentId}`, { status: Status.outOfDate }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status.');
                    return reply(error);
                }
                server.inject(`/agent/${domainAgentId}`, (res) => {

                    if (res.statusCode === 200){
                        server.publish(`/agent/${agentId}`, res.result);
                    }
                    return reply({ message: 'successful operation' }).code(200);
                });
            });
        }
        else {
            return reply({ message: 'successful operation' }).code(200);
        }
    });
};
