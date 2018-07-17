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

                    ActionTools.validateKeywordsTool(redis, agentId, action.slots, (err) => {

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
        addToAgent: (cb) => {

            redis.zadd(`agentActions:${agentId}`, 'NX', actionId, action.actionName, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the actions list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }
                const error = Boom.badRequest(`A action with this name already exists in the agent ${action.agent}.`);
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
        return reply(result.action);
    });
};
