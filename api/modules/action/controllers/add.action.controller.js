'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const ActionTools = require('../tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let actionId = null;
    let agentId = null;
    let domainId = null;
    let action = request.payload;
    const server = request.server;
    const redis = server.app.redis;

    Async.series({
        fathersCheck: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', action.agent, (err, id) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id) {
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${action.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    Async.parallel([
                        (cllbk) => {

                            redis.zscore(`agentDomains:${agentId}`, action.domain, (err, id) => {

                                if (err) {
                                    const error = Boom.badImplementation(`An error occurred checking if the domain ${action.domain} exists in the agent ${action.agent}.`);
                                    return cllbk(error);
                                }
                                if (id) {
                                    domainId = id;
                                    return cllbk(null);
                                }
                                const error = Boom.badRequest(`The domain ${action.domain} doesn't exist in the agent ${action.agent}`);
                                return cllbk(error);
                            });
                        },
                        (cllbk) => {

                            ActionTools.validateKeywordsTool(redis, agentId, action.slots, (err) => {

                                if (err) {
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        }
                    ], (err) => {

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
        actionId: (cb) => {

            redis.incr('actionId', (err, newActionId) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the new action id.');
                    return cb(error);
                }
                actionId = newActionId;
                return cb(null);
            });
        },
        addToDomain: (cb) => {

            redis.zadd(`domainActions:${domainId}`, 'NX', actionId, action.actionName, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the actions list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }
                const error = Boom.badRequest(`A action with this name already exists in the domain ${action.domain}.`);
                return cb(error);
            });
        },
        addToKeywords: (cb) => {

            Async.eachSeries(action.slots, (slot, nextSlot) => {

                //Only system keywords have an extractor specified, so ignore sys keywords
                if (slot.keyword.indexOf('sys.') > -1){
                    return nextSlot(null);
                }
                redis.zadd(`keywordActions:${slot.keywordId}`, 'NX', actionId, action.actionName, (err) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred adding the action to the keyword list.');
                        return nextSlot(error);
                    }
                    return nextSlot(null);
                });
            }, cb);
        },
        action: (cb) => {

            action = Object.assign({ id: actionId }, action);
            const flatAction = RemoveBlankArray(Flat(action));
            redis.hmset(`action:${actionId}`, flatAction, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the action data.');
                    return cb(error);
                }
                return cb(null, action);
            });
        }
    }, (err, result) => {

        if (err) {
            return reply(err, null);
        }

        const resultAction = result.action;

        ActionTools.updateKeywordsDomainTool(server, redis, resultAction, agentId, domainId, null, (err) => {

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
                    return reply(resultAction);
                });
            });
        });
    });
};
