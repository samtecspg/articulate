'use strict';
const Boom = require('boom');
const Async = require('async');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.exists(`agentPostFormat:${agentId}`, (err, exists) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the webhook.');
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

            redis.del(`agentPostFormat:${agentId}`, (err, success) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred deleting the webhook.');
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
