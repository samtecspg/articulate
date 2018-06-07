'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    let domainId = null;
    let intentId = null;
    let webhook = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        fathersCheck: (cb) => {

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

                    redis.zscore(`agentDomains:${agentId}`, webhook.domain, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the domain ${webhook.domain} exists in the agent ${webhook.agent}.`);
                            return callback(error);
                        }
                        if (id){
                            domainId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The domain ${webhook.domain} doesn't exist in the agent ${webhook.agent}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    redis.zscore(`domainIntents:${domainId}`, webhook.intent, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the intent ${webhook.intent} exists in the domain ${webhook.domain}.`);
                            return cllbk(error);
                        }
                        if (id){
                            intentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The intent ${webhook.intent} doesn't exist in the domain ${webhook.domain}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    redis.exists(`intentWebhook:${intentId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the webhook.');
                            return cb(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('An webhook already exists for this intent. If you want to change it please use the update endpoint.');
                            return cb(error);
                        }
                        return cb(null);
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

            webhook = Object.assign({ id: intentId }, webhook);
            const flatWebhook = RemoveBlankArray(Flat(webhook));
            redis.hmset(`intentWebhook:${intentId}`, flatWebhook, (err) => {

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
