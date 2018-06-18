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
    let postFormat = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        fathersCheck: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', postFormat.agent, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id){
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${postFormat.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    redis.zscore(`agentDomains:${agentId}`, postFormat.domain, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the domain ${postFormat.domain} exists in the agent ${postFormat.agent}.`);
                            return callback(error);
                        }
                        if (id){
                            domainId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The domain ${postFormat.domain} doesn't exist in the agent ${postFormat.agent}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    redis.zscore(`domainIntents:${domainId}`, postFormat.intent, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the intent ${postFormat.intent} exists in the domain ${postFormat.domain}.`);
                            return cllbk(error);
                        }
                        if (id){
                            intentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The intent ${postFormat.intent} doesn't exist in the domain ${postFormat.domain}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    redis.exists(`intentPostFormat:${intentId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the post format.');
                            return cb(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('An post format already exists for this intent. If you want to change it please use the update endpoint.');
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
        postFormat: (cb) => {

            postFormat = Object.assign({ id: intentId }, postFormat);
            const flatPostFormat = RemoveBlankArray(Flat(postFormat));
            redis.hmset(`intentPostFormat:${intentId}`, flatPostFormat, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the post format data.');
                    return cb(error);
                }
                return cb(null, postFormat);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Cast(result.postFormat, 'postFormat'));
    });
};
