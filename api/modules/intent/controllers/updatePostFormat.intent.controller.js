'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, intentId, currentPostFormat, updateData, cb) => {

    const flatPostFormat = Flat(currentPostFormat);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatPostFormat[key] = flatUpdateData[key];
    });
    redis.del(`intentPostFormat:${intentId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporaly removing the post format for the update.');
            return cb(error);
        }
        redis.hmset(`intentPostFormat:${intentId}`, RemoveBlankArray(flatPostFormat), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the post format data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatPostFormat));
        });
    });
};

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/intent/${intentId}/postFormat`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified post format doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the post format for the intent ${intentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentPostFormat, cb) => {

            updateDataFunction(redis, intentId, currentPostFormat, updateData, (err, result) => {

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
