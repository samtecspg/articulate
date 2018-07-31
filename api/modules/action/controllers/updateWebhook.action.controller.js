'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, actionId, currentWebhook, updateData, cb) => {

    if (updateData.slots){
        currentWebhook.slots = updateData.slots;
    }
    if (updateData.actionResponses){
        currentWebhook.actionResponses = updateData.actionResponses;
    }
    const flatWebhook = Flat(currentWebhook);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatWebhook[key] = flatUpdateData[key];
    });
    redis.del(`actionWebhook:${actionId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporaly removing the webhook for the update.');
            return cb(error);
        }
        redis.hmset(`actionWebhook:${actionId}`, RemoveBlankArray(flatWebhook), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the webhook data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatWebhook));
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

            server.inject(`/action/${actionId}/webhook`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified webhook doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the webhook ${actionId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentWebhook, cb) => {

            updateDataFunction(redis, actionId, currentWebhook, updateData, (err, result) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the webhook data.');
                    return cb(error);
                }
                return cb(null, result);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Cast(result, 'webhook'));
    });
};
