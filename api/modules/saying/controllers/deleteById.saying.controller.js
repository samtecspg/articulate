'use strict';
const Async = require('async');
const Boom = require('boom');
const SayingTools = require('../tools');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    const sayingId = request.params.id;
    let saying;
    let agentId;
    let domainId;
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
                saying = res.result;
                return cb(null);
            });
        },
        (callbackDeleteSayingAndReferences) => {

            Async.parallel([
                (callbackDeleteSaying) => {

                    redis.del(`saying:${sayingId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the saying ${sayingId}`);
                            return callbackDeleteSaying(error, null);
                        }
                        return callbackDeleteSaying(null);
                    });
                },
                (callbackDeleteSayingFromTheDomain) => {

                    Async.waterfall([
                        (callbackGetAgentId) => {

                            redis.zscore('agents', saying.agent, (err, score) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${saying.agent}`);
                                    return callbackGetAgentId(error);
                                }
                                agentId = score;
                                return callbackGetAgentId(null);
                            });
                        },
                        (callbackGetDomain) => {

                            redis.zscore(`agentDomains:${agentId}`, saying.domain, (err, score) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the domain ${saying.domain}`);
                                    return callbackGetDomain(error);
                                }
                                domainId = score;
                                return callbackGetDomain(null);
                            });
                        },
                        (callbackRemoveFromDomainsList) => {

                            redis.zrem(`domainSayings:${domainId}`, saying.id, (err, removeResult) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the saying ${sayingId} from the sayings list of the domain ${domainId}`);
                                    return callbackRemoveFromDomainsList(error);
                                }
                                return callbackRemoveFromDomainsList(null);
                            });
                        },
                        (callbackRemoveFromKeywordsList) => {

                            Async.eachSeries(saying.keywords, (keyword, nextKeyword) => {

                                redis.zrem(`keywordSayings:${keyword.keywordId}`, saying.sayingName, (err) => {

                                    if (err){
                                        const error = Boom.badImplementation( `An error occurred removing the saying ${sayingId} from the sayings list of the keyword ${keyword.keywordId}`);
                                        return nextKeyword(error);
                                    }
                                    return nextKeyword(null);
                                });
                            }, callbackRemoveFromKeywordsList);
                        }
                    ], (err) => {

                        if (err){
                            return callbackDeleteSayingFromTheDomain(err);
                        }
                        return callbackDeleteSayingFromTheDomain(null);
                    });
                }
            ], (err) => {

                if (err){
                    return callbackDeleteSayingAndReferences(err);
                }
                return callbackDeleteSayingAndReferences(null);
            });
        }
    ], (err) => {

        if (err){
            return reply(err, null);
        }
        SayingTools.updateKeywordsDomainTool(server, redis, { domain: saying.domain, keywords: [] }, agentId, domainId, saying.keywords, (err) => {

            if (err) {
                return reply(err);
            }
            redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status.');
                    return reply(error);
                }
                redis.hmset(`domain:${domainId}`, { status: Status.outOfDate }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred updating the domain status.');
                        return reply(error);
                    }
                    server.inject(`/agent/${agentId}`, (res) => {

                        if (res.statusCode === 200){
                            server.publish(`/agent/${agentId}`, res.result);
                        }
                        return reply({ message: 'successful operation' }).code(200);
                    });
                });
            });
        });
    });
};
