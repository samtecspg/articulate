'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const SayingTools = require('../tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let sayingId = null;
    let agentId = null;
    let domainId = null;
    let saying = request.payload;
    const server = request.server;
    const redis = server.app.redis;

    Async.series({
        fathersCheck: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', saying.agent, (err, id) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id) {
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${saying.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    Async.parallel([
                        (cllbk) => {

                            redis.zscore(`agentDomains:${agentId}`, saying.domain, (err, id) => {

                                if (err) {
                                    const error = Boom.badImplementation(`An error occurred checking if the domain ${saying.domain} exists in the agent ${saying.agent}.`);
                                    return cllbk(error);
                                }
                                if (id) {
                                    domainId = id;
                                    return cllbk(null);
                                }
                                const error = Boom.badRequest(`The domain ${saying.domain} doesn't exist in the agent ${saying.agent}`);
                                return cllbk(error);
                            });
                        },
                        (cllbk) => {

                            SayingTools.validateKeywordsTool(redis, agentId, saying.keywords, (err) => {

                                if (err) {
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        }
                    ], (err, result) => {

                        if (err) {
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err) => {

                if (err) {
                    return cb(err, null);
                }
                return cb(null);
            });
        },
        sayingId: (cb) => {

            redis.incr('sayingId', (err, newSayingId) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the new saying id.');
                    return cb(error);
                }
                sayingId = newSayingId;
                return cb(null);
            });
        },
        addToDomain: (cb) => {

            redis.zadd(`domainSayings:${domainId}`, 'NX', sayingId, sayingId, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the sayings list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }
                const error = Boom.badRequest(`A saying with this name already exists in the domain ${saying.domain}.`);
                return cb(error);
            });
        },
        addToKeywords: (cb) => {

            Async.eachSeries(saying.keywords, (keyword, nextKeyword) => {

                //Only system keywords have an extractor specified, so ignore sys keywords
                if (keyword.extractor){
                    return nextKeyword(null);
                }
                redis.zadd(`keywordSayings:${keyword.keywordId}`, 'NX', sayingId, saying.id, (err) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred adding the saying to the keyword list.');
                        return nextKeyword(error);
                    }
                    return nextKeyword(null);
                });
            }, cb);
        },
        saying: (cb) => {

            saying = Object.assign({ id: sayingId }, saying);

            const keywords = _.sortBy(saying.keywords, (keyword) => {

                return keyword.start;
            });
            saying.keywords = keywords;
            const flatSaying = RemoveBlankArray(Flat(saying));
            redis.hmset(`saying:${sayingId}`, flatSaying, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the saying data.');
                    return cb(error);
                }
                return cb(null, saying);
            });
        }
    }, (err, result) => {

        if (err) {
            return reply(err, null);
        }

        const resultSaying = result.saying;

        SayingTools.updateKeywordsDomainTool(server, redis, resultSaying, agentId, domainId, null, (err) => {

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
                    return reply(resultSaying);
                });
            });
        });
    });
};
