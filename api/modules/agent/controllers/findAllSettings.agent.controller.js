'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const server = request.server;
    const redis = server.app.redis;
    const settingsResult = {};

    Async.waterfall([
        (cb) => {

            redis.smembers(`agentSettings:${agentId}`, (err, result) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the list of settings names');
                    return cb(error);
                }
                return cb(null, result);
            });
        },
        (settings, cb) => {

            Async.each(settings, (setting, callback) => {

                server.inject(`/agent/${agentId}/settings/${setting}`, (res) => {

                    if (res.statusCode !== 200){
                        if (res.statusCode === 404){
                            const error = Boom.notFound('The specified setting doesn\'t exists');
                            return callback(error, null);
                        }
                        const error = Boom.create(res.statusCode, `An error occurred getting the setting ${setting}`);
                        return callback(error, null);
                    }
                    settingsResult[setting] = res.result;
                    return callback(null);
                });
            }, (err) => {

                if (err){
                    return cb(err);
                }
                return cb(null);
            });
        }
    ], (err) => {

        if (err){
            return reply(err);
        }
        return reply(settingsResult);
    });
};
