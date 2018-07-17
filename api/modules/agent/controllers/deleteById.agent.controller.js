'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
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
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the agent ${agentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentAgent, cb) => {

            Async.waterfall([
                (callback) => {

                    Async.parallel([
                        (callbackDeleteAgentDomains) => {

                            Async.waterfall([
                                (callbackGetDomains) => {

                                    server.inject(`/agent/${agentId}/domain`, (res) => {

                                        if (res.statusCode !== 200){
                                            const error = Boom.create(res.statusCode, `An error occurred getting the domains to delete from the agent ${agentId}`);
                                            return callbackGetDomains(error, null);
                                        }
                                        return callbackGetDomains(null, res.result.domains);
                                    });
                                },
                                (domains, callbackDeleteEachDomain) => {

                                    Async.map(domains, (domain, callbackMapOfDomain) => {

                                        Async.waterfall([
                                            (callbackDeleteDomainSons) => {

                                                Async.waterfall([
                                                    (callbackGetSayings) => {

                                                        server.inject(`/domain/${domain.id}/saying`, (res) => {

                                                            if (res.statusCode !== 200){
                                                                const error = Boom.create(res.statusCode, `An error occurred getting the sayings to delete of the domain ${domain.domainName}`);
                                                                return callbackGetSayings(error, null);
                                                            }
                                                            return callbackGetSayings(null, res.result.sayings);
                                                        });
                                                    },
                                                    (sayings, callbackDeleteSayingAndScenario) => {

                                                        Async.map(sayings, (saying, callbackMapOfSaying) => {

                                                            Async.parallel([
                                                                (callbackDeleteSaying) => {

                                                                    redis.del(`saying:${saying.id}`, (err, result) => {

                                                                        if (err){
                                                                            const error = Boom.badImplementation(`An error occurred deleting the saying ${saying.id} linked with the agent ${agentId}`);
                                                                            return callbackDeleteSaying(error, null);
                                                                        }
                                                                        return callbackDeleteSaying(null);
                                                                    });
                                                                },
                                                                (callbackDeleteScenario) => {

                                                                    redis.del(`scenario:${saying.id}`, (err, result) => {

                                                                        if (err){
                                                                            const error = Boom.badImplementation(`An error occurred deleting the scenario of the saying ${saying.id} linked with the agent ${agentId}`);
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

                                                        redis.del(`domain:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the domain ${domain.id} from the agent ${agentId}`);
                                                                return callbackDeleteDomain(error, null);
                                                            }
                                                            return callbackDeleteDomain(null);
                                                        });
                                                    },
                                                    (callbackDeleteDomainSayingsList) => {

                                                        redis.del(`domainSayings:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the list of sayings for domain ${domain.id}`);
                                                                return callbackDeleteDomainSayingsList(error, null);
                                                            }
                                                            return callbackDeleteDomainSayingsList(null);
                                                        });
                                                    },
                                                    (callbackDeleteDomainKeywordsList) => {

                                                        redis.del(`domainKeywords:${domain.id}`, (err, result) => {

                                                            if (err){
                                                                const error = Boom.badImplementation(`An error occurred deleting the list of keywords for domain ${domain.id}`);
                                                                return callbackDeleteDomainKeywordsList(error, null);
                                                            }
                                                            return callbackDeleteDomainKeywordsList(null);
                                                        });
                                                    }
                                                ], (err, result) => {

                                                    if (err){
                                                        return callbackDeleteDomainAndReferences(err);
                                                    }
                                                    return callbackDeleteDomainAndReferences(null, result);
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
                                            return callbackDeleteEachDomain(err);
                                        }
                                        return callbackDeleteEachDomain(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteAgentDomains(err);
                                }
                                return callbackDeleteAgentDomains(null);
                            });
                        },
                        (callbackDeleteAgentKeywords) => {

                            Async.waterfall([
                                (callbackGetKeywords) => {

                                    server.inject(`/agent/${agentId}/keyword`, (res) => {

                                        if (res.statusCode !== 200){
                                            const error = Boom.create(res.statusCode, `An error occurred getting the keywords to delete of the agent ${agentId}`);
                                            return callbackGetKeywords(error, null);
                                        }
                                        return callbackGetKeywords(null, res.result.keywords);
                                    });
                                },
                                (keywords, callbackDeleteEachKeyword) => {

                                    Async.map(keywords, (keyword, callbackMapOfKeyword) => {

                                        Async.parallel([
                                            (callbackDeleteKeyword) => {

                                                redis.del(`keyword:${keyword.id}`, (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred deleting the keyword ${keyword.id} linked with the agent ${agentId}`);
                                                        return callbackDeleteKeyword(error, null);
                                                    }
                                                    return callbackDeleteKeyword(null);
                                                });
                                            },
                                            (callbackDeleteKeywordsDomainList) => {

                                                redis.del(`keywordDomain:${keyword.id}`, (err, result) => {

                                                    if (err){
                                                        const error = Boom.badImplementation(`An error occurred deleting the list of domains for keyword ${keyword.id}`);
                                                        return callbackDeleteKeywordsDomainList(error, null);
                                                    }
                                                    return callbackDeleteKeywordsDomainList(null);
                                                });
                                            }
                                        ], (err, result) => {

                                            if (err){
                                                return callbackMapOfKeyword(err);
                                            }
                                            return callbackMapOfKeyword(null, result);
                                        });
                                    }, (err, result) => {

                                        if (err){
                                            return callbackDeleteEachKeyword(err);
                                        }
                                        return callbackDeleteEachKeyword(null);
                                    });
                                }
                            ], (err, result) => {

                                if (err){
                                    return callbackDeleteAgentKeywords(err);
                                }
                                return callbackDeleteAgentKeywords(null);
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
                            const error = Boom.badImplementation( `An error occurred removing the name ${currentAgent.agentName} from the agents list of the agents`);
                            return callback(error);
                        }
                        return callback(null);
                    });
                },
                (callback) => {

                    Async.parallel([
                        (callbackDeleteAgentSet) => {

                            redis.del(`agent:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentSet(error, null);
                                }
                                return callbackDeleteAgentSet(null);
                            });
                        },
                        (callbackDeleteDomainRecognitionLog) => {

                            redis.del(`agentDomainRecognizer:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation('An error occurred deleting the agent domain recognition log');
                                    return callbackDeleteDomainRecognitionLog(error, null);
                                }
                                return callbackDeleteDomainRecognitionLog(null);
                            });
                        },
                        (callbackDeleteAgentDomainsList) => {

                            redis.del(`agentDomains:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentDomainsList(error, null);
                                }
                                return callbackDeleteAgentDomainsList(null);
                            });
                        },
                        (callbackDeleteAgentKeywordsList) => {

                            redis.del(`agentKeywords:${agentId}`, (err, result) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred deleting the agent ${agentId}`);
                                    return callbackDeleteAgentKeywordsList(error, null);
                                }
                                return callbackDeleteAgentKeywordsList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return cb(err);
                }
                return cb(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
