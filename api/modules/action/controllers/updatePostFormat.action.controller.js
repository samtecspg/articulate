'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, actionId, currentPostFormat, updateData, cb) => {

    const flatPostFormat = Flat(currentPostFormat);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatPostFormat[key] = flatUpdateData[key];
    });
    redis.del(`actionPostFormat:${actionId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporarily removing the post format for the update.');
            return cb(error);
        }
        redis.hmset(`actionPostFormat:${actionId}`, RemoveBlankArray(flatPostFormat), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the post format data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatPostFormat));
        });
    });
};

module.exports = (request, reply) => {

    const actionId = request.params.id;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/action/${actionId}/postFormat`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified post format doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the post format for the action ${actionId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentPostFormat, cb) => {

            updateDataFunction(redis, actionId, currentPostFormat, updateData, (err, result) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the post format data.');
                    return cb(error);
                }
                return cb(null, result);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Cast(result, 'postFormat'));
    });
};
