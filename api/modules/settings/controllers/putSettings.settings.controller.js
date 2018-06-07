'use strict';
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Async = require('async');

module.exports = (request, reply) => {

    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    const settings = Object.keys(updateData);

    Async.each(settings, (setting, callback) => {

        Async.waterfall([
            (callbck) => {

                redis.sismember('settings', setting, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation(`An error occurred checking if the setting ${setting} exists`);
                        return callbck(error);
                    }
                    return callbck(null, result);
                });
            },
            (isMember, callbck) => {

                if (isMember){
                    return callbck(null);
                }
                redis.sadd('settings', setting, (err) => {

                    if (err){
                        const error = Boom.badImplementation(`An error occurred adding the setting ${setting} to the list of settings`);
                        return callbck(error);
                    }
                    return callbck(null);
                });
            },
            (callbck) => {

                let flatData = {};
                if (typeof updateData[setting] === 'string'){
                    flatData.string_value_setting = updateData[setting];
                }
                else {
                    flatData = Flat(updateData[setting]);
                }
                redis.del(`settings:${setting}`, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred temporaly removing the setting for the update.');
                        return callbck(error);
                    }
                    redis.hmset(`settings:${setting}`, flatData, (err) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred updating the setting ${setting}.`);
                            return callbck(error);
                        }
                        return callbck(null);
                    });
                });
            }
        ], (err) => {

            if (err){
                return callback(err);
            }
            return callback(null);
        });
    }, (err) => {

        if (err){
            return reply(err);
        }
        server.inject('/settings', (res) => {

            if (res.statusCode !== 200){
                const error = Boom.create(res.statusCode, 'An error occurred retrieving the settings after update');
                return reply(error);
            }
            return reply(res.result);
        });
    });
};
