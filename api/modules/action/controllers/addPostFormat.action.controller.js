'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    let actionId = null;
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

                    redis.zscore(`agentActions:${agentId}`, postFormat.action, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the action ${postFormat.action} exists in the agent ${postFormat.agent}.`);
                            return cllbk(error);
                        }
                        if (id){
                            actionId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The action ${postFormat.action} doesn't exist in the agent ${postFormat.agent}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    redis.exists(`actionPostFormat:${actionId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the post format.');
                            return cb(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('An post format already exists for this action. If you want to change it please use the update endpoint.');
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

            postFormat = Object.assign({ id: actionId }, postFormat);
            const flatPostFormat = RemoveBlankArray(Flat(postFormat));
            redis.hmset(`actionPostFormat:${actionId}`, flatPostFormat, (err) => {

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
