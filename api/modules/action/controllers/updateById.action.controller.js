'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const ActionTools = require('../tools');
const _ = require('lodash');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

const updateDataFunction = (redis, server, actionId, currentAction, updateData, agentId, domainId, cb) => {

    const oldSlots = _.cloneDeep(currentAction.slots);
    if (updateData.slots){
        currentAction.slots = updateData.slots;
    }
    const flatAction = Flat(currentAction);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatAction[key] = flatUpdateData[key];
    });
    const resultAction = Flat.unflatten(flatAction);

    Async.series({
        temporalDelete: (callback) => {

            redis.del(`action:${actionId}`, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred temporaly removing the action for the update.');
                    return callback(error);
                }
                return callback(null);
            });
        },
        actionKeywordsUnlink: (callback) => {

            Async.eachSeries(oldSlots, (slot, nextSlot) => {

                redis.zrem(`keywordActions:${slot.keywordId}`, currentAction.actionName, (err) => {

                    if (err){
                        const error = Boom.badImplementation( `An error occurred removing the action ${actionId} from the actions list of the keyword ${slot.keyword}`);
                        return nextSlot(error);
                    }
                    return nextSlot(null);
                });
            }, callback);
        },
        actionKeywordsLink: (callback) => {

            Async.eachSeries(resultAction.slots, (slot, nextSlot) => {

                //Only system keywords have an extractor specified, so ignore sys keywords
                if (slot.keyword.indexOf('sys.') > -1){
                    return nextKeyword(null);
                }
                redis.zadd(`keywordActions:${slot.keywordId}`, 'NX', actionId, resultAction.actionName, (err) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred adding the action to the keyword list.');
                        return nextSlot(error);
                    }
                    return nextSlot(null);
                });
            }, callback);
        },
        action: (callback) => {

            redis.hmset(`action:${actionId}`, RemoveBlankArray(flatAction), (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the action data.');
                    return callback(error);
                }
                return callback(null, resultAction);
            });
        }
    }, (err, result) => {

        if (err){
            return cb(err);
        }
        return cb(null, result.action);
    });
};

module.exports = (request, reply) => {

    const actionId = request.params.id;
    let agentId = null;
    let domainId = null;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/action/${actionId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified action doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the action ${actionId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentAction, cb) => {

            redis.zscore('agents', currentAction.agent, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the agent.');
                    return cb(error);
                }
                if (id){
                    agentId = id;
                    return cb(null, currentAction);
                }
                const error = Boom.badRequest(`The agent ${currentAction.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentAction, cb) => {

            redis.zscore(`agentDomains:${agentId}`, currentAction.domain, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the domain.');
                    return cb(error);
                }
                if (id){
                    domainId = id;
                    return cb(null, currentAction);
                }
                const error = Boom.badRequest(`The domain ${currentAction.domain} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentAction, cb) => {

            if (updateData.slots){
                ActionTools.validateKeywordsTool(redis, agentId, action.slots, (err) => {

                    if (err) {
                        return cb(err);
                    }
                    return cb(null, currentAction);
                });
            }
            else {
                return cb(null, currentAction);
            }
        },
        (currentAction, cb) => {

            if (updateData.actionName && updateData.actionName !== currentAction.actionName){
                Async.waterfall([
                    (callback) => {

                        redis.zadd(`domainActions:${domainId}`, 'NX', actionId, updateData.actionName, (err, addResponse) => {

                            if (err) {
                                const error = Boom.badImplementation(`An error occurred adding the name ${updateData.actionName} to the actions list of the domain ${currentAction.domain}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A action with the name ${updateData.actionName} already exists in the domain ${currentAction.domain}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zrem(`domainActions:${domainId}`, currentAction.actionName, (err) => {

                            if (err){
                                const error = Boom.badImplementation( `An error occurred removing the name ${currentAction.actionName} from the actions list of the agent ${currentAction.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, server, actionId, currentAction, updateData, agentId, domainId, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the action data.');
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
                updateDataFunction(redis, server, actionId, currentAction, updateData, agentId, domainId, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the action data.');
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

        redis.exists(`actionWebhook:${result.id}`, (err, exists) => {

            if (err){
                const error = Boom.badImplementation('Action updated. An error occurred checking if the scenario exists.');
                return reply(error);
            }
            if (exists){
                redis.hmset(`actionWebhook:${result.id}`, { action: result.actionName }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('Action updated. An error occurred updating the new values in the scenario of the action.');
                        return reply(error);
                    }
                    return reply(Cast(result, 'action'));
                });
            }
            else {
                return reply(Cast(result, 'action'));
            }
        });
    });
};
