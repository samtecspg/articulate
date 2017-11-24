'use strict';
const Boom = require('boom');
const Async = require('async');
const Flat = require('flat');

module.exports = (request, reply) => {

    const scenarioId = request.params.id;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.exists('scenario:' + scenarioId, (err, exists) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the scenario.');
                    return cb(error);
                }
                if (exists){
                    return cb(null);
                }
                else {
                    const error = Boom.notFound('The specified scenario doesn\'t exists');
                    return cb(error);                    
                }
            });
        },
        (cb) => {
            
            redis.del('scenario:' + scenarioId, (err, success) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred deleting the scenario.');
                    return cb(error);
                }
                if (success === 1){
                    return cb(null);
                }
                else {
                    const error = Boom.notFound('The scenario wasn\'t deleted');
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
