'use strict';
const Boom = require('boom');
const Async = require('async');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.exists(`intentWebhook:${intentId}`, (err, exists) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the webhook.');
                    return cb(error);
                }
                if (exists){
                    return cb(null);
                }
                const error = Boom.notFound('The specified webhook doesn\'t exists');
                return cb(error);
            });
        },
        (cb) => {

            redis.del(`intentWebhook:${intentId}`, (err, success) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred deleting the webhook.');
                    return cb(error);
                }
                if (success === 1){
                    return cb(null);
                }
                const error = Boom.notFound('The webhook wasn\'t deleted');
                return cb(error);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
