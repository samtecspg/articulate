'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const keywordId = request.params.id;
    let keyword;
    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/keyword/${keywordId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified keyword doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the keyword ${keywordId}`);
                    return cb(error, null);
                }
                keyword = res.result;
                return cb(null);
            });
        },
        (callbackCheckKeywordNotInUse) => {

            redis.smembers(`keywordDomain:${keyword.id}`, (err, domains) => {

                if (err){
                    const error = Boom.badImplementation(`An error occurred getting the list of domains of the keyword ${keyword.keywordName}sx`);
                    return callbackCheckKeywordNotInUse(error, null);
                }
                if (domains && domains.length > 0){
                    const error = Boom.badRequest(`The keyword ${keyword.keywordName} is being used by the domain(s) ${domains}`);
                    return callbackCheckKeywordNotInUse(error, null);
                }
                return callbackCheckKeywordNotInUse(null);
            });
        },
        (callbackDeleteKeywordAndReferences) => {

            Async.parallel([
                (callbackDeleteKeyword) => {

                    redis.del(`keyword:${keywordId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the keyword ${keywordId} from the keyword ${keywordId}`);
                            return callbackDeleteKeyword(error, null);
                        }
                        return callbackDeleteKeyword(null);
                    });
                },
                (callbackDeleteKeywordDomainsLists) => {

                    redis.del(`keywordDomains:${keywordId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the domains list from the keyword ${keywordId}`);
                            return callbackDeleteKeywordDomainsLists(error, null);
                        }
                        return callbackDeleteKeywordDomainsLists(null);
                    });
                },
                (callbackDeleteKeywordFromTheAgent) => {

                    Async.waterfall([
                        (callbackGetAgent) => {

                            redis.zscore('agents', keyword.agent, (err, agentId) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${keyword.agent}`);
                                    return callbackGetAgent(error);
                                }
                                return callbackGetAgent(null, agentId);
                            });
                        },
                        (agentId, callbackRemoveFromAgentsList) => {

                            redis.zrem(`agentKeywords:${agentId}`, keyword.keywordName, (err, removeResult) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the keyword ${keywordId} from the keywords list of the agent ${agentId}`);
                                    return callbackRemoveFromAgentsList(error);
                                }
                                return callbackRemoveFromAgentsList(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callbackDeleteKeywordFromTheAgent(err);
                        }
                        return callbackDeleteKeywordFromTheAgent(null);
                    });
                }
            ], (err, result) => {

                if (err){
                    return callbackDeleteKeywordAndReferences(err);
                }
                return callbackDeleteKeywordAndReferences(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
