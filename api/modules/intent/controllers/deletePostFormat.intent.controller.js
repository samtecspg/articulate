'use strict';
const Boom = require('boom');
const Async = require('async');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.exists(`intentPostFormat:${intentId}`, (err, exists) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the post format.');
                    return cb(error);
                }
                if (exists){
                    return cb(null);
                }
                const error = Boom.notFound('The specified post format doesn\'t exists');
                return cb(error);
            });
        },
        (cb) => {

            redis.del(`intentPostFormat:${intentId}`, (err, success) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred deleting the post format.');
                    return cb(error);
                }
                if (success === 1){
                    return cb(null);
                }
                const error = Boom.notFound('The post format wasn\'t deleted');
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
