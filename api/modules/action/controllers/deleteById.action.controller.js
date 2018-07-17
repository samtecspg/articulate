'use strict';
const Async = require('async');
const Boom = require('boom');
const ActionTools = require('../tools');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    const actionId = request.params.id;
    let action;
    let agentId;
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
                action = res.result;
                return cb(null);
            });
        },
        (callbackDeleteActionAndReferences) => {

            Async.parallel([
                (callbackDeleteAction) => {

                    redis.del(`action:${actionId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the action ${actionId}`);
                            return callbackDeleteAction(error, null);
                        }
                        return callbackDeleteAction(null);
                    });
                },
                (callbackDeleteWebhook) => {

                    redis.del(`actionWebhook:${actionId}`, (err, result) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred deleting the webhook of the action ${actionId}`);
                            return callbackDeleteWebhook(error, null);
                        }
                        return callbackDeleteWebhook(null);
                    });
                },
                (callbackDeleteActionFromTheDomain) => {

                    Async.waterfall([
                        (callbackGetAgentId) => {

                            redis.zscore('agents', action.agent, (err, score) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred retrieving the id of the agent ${action.agent}`);
                                    return callbackGetAgentId(error);
                                }
                                agentId = score;
                                return callbackGetAgentId(null);
                            });
                        },
                        (callbackRemoveFromAgentList) => {

                            redis.zrem(`agentActions:${agentId}`, action.actionName, (err) => {

                                if (err){
                                    const error = Boom.badImplementation( `An error occurred removing the action ${actionId} from the actions list of the agent ${agentId}`);
                                    return callbackRemoveFromAgentList(error);
                                }
                                return callbackRemoveFromAgentList(null);
                            });
                        },
                        (callbackRemoveFromKeywordsList) => {

                            Async.eachSeries(action.slots, (slot, nextSlot) => {

                                redis.zrem(`keywordActions:${slot.keywordId}`, action.actionName, (err) => {

                                    if (err){
                                        const error = Boom.badImplementation( `An error occurred removing the action ${actionId} from the actions list of the keyword ${keyword.keywordId}`);
                                        return nextSlot(error);
                                    }
                                    return nextSlot(null);
                                });
                            }, callbackRemoveFromKeywordsList);
                        }
                    ], (err) => {

                        if (err){
                            return callbackDeleteActionFromTheDomain(err);
                        }
                        return callbackDeleteActionFromTheDomain(null);
                    });
                }
            ], (err) => {

                if (err){
                    return callbackDeleteActionAndReferences(err);
                }
                return callbackDeleteActionAndReferences(null);
            });
        }
    ], (err) => {

        if (err){
            return reply(err, null);
        }

        return reply({ message: 'successful operation' }).code(200);
    });
};
