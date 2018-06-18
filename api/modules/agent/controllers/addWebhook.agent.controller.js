'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    let webhook = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        check: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', webhook.agent, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id){
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${webhook.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    redis.exists(`agentWebhook:${agentId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the webhook.');
                            return callback(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('An webhook already exists for this agent. If you want to change it please use the update endpoint.');
                            return callback(error);
                        }
                        return callback(null);
                    });
                }
            ], (err) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null);
            });
        },
        webhook: (cb) => {

            webhook = Object.assign({ id: agentId }, webhook);
            const flatWebhook = RemoveBlankArray(Flat(webhook));
            redis.hmset(`agentWebhook:${agentId}`, flatWebhook, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the webhook data.');
                    return cb(error);
                }
                return cb(null, webhook);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Cast(result.webhook, 'webhook'));
    });
};
