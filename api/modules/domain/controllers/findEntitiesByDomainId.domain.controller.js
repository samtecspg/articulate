'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    const domainId = request.params.id;

    Async.waterfall([
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the domain');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.smembers(`domainEntities:${domainId}`, (err, entities) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the entities from the sorted set.');
                    return cb(error);
                }
                return cb(null, entities);
            });
        },
        (entities, cb) => {

            Async.map(entities, (entity, callback) => {

                server.inject('/entity/' + entity, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the entity ${entity[1]}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, result);
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
