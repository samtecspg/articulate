'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    let postFormat = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        check: (cb) => {

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

                    redis.exists(`agentPostFormat:${agentId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the postFormat.');
                            return callback(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('A postFormat already exists for this agent. If you want to change it please use the update endpoint.');
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
        postFormat: (cb) => {

            postFormat = Object.assign({ id: agentId }, postFormat);
            const flatPostFormat = RemoveBlankArray(Flat(postFormat));
            redis.hmset(`agentPostFormat:${agentId}`, flatPostFormat, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the postFormat data.');
                    return cb(error);
                }
                return cb(null, postFormat);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result.postFormat);
    });
};
