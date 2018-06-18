'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, agentId, currentPostFormat, updateData, cb) => {

    const flatPostFormat = Flat(currentPostFormat);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatPostFormat[key] = flatUpdateData[key];
    });
    redis.del(`agentPostFormat:${agentId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporaly removing the post format for the update.');
            return cb(error);
        }
        redis.hmset(`agentPostFormat:${agentId}`, RemoveBlankArray(flatPostFormat), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the post format data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatPostFormat));
        });
    });
};

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/agent/${agentId}/postFormat`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified post format doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the post format ${agentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentPostFormat, cb) => {

            updateDataFunction(redis, agentId, currentPostFormat, updateData, (err, result) => {

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
