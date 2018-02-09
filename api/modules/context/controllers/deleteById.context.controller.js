'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    const sessionId = request.params.sessionId;

    Async.waterfall([
        (cb) => {

            redis.exists(`sessionContexts:${sessionId}`, (err, exists) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the session.');
                    return cb(error);
                }
                if (exists){
                    return cb(null);
                }
                const error = Boom.notFound('The specified session doesn\'t exists');
                return cb(error);
            });
        },
        (cb) => {

            redis.del(`sessionContexts:${sessionId}`, (err, success) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred deleting the session.');
                    return cb(error);
                }
                if (success === 1){
                    return cb(null);
                }
                const error = Boom.notFound('The session wasn\'t deleted');
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
