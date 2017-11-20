'use strict';
const Boom = require('boom');
const Async = require('async');
const Flat = require('flat');

module.exports = (request, reply) => {

    const contextId = request.params.id;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.exists('context:' + contextId, (err, exists) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the context.');
                    return cb(error);
                }
                if (exists){
                    return cb(null);
                }
                else {
                    const error = Boom.notFound('The specified context doesn\'t exists');
                    return cb(error);                    
                }
            });
        },
        (cb) => {
            
            redis.del('context:' + contextId, (err, success) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred deleting the context.');
                    return cb(error);
                }
                if (success === 1){
                    return cb(null);
                }
                else {
                    const error = Boom.notFound('The context wasn\'t deleted');
                    return cb(error);                    
                }
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
