'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const entityId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('entity:' + entityId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the entity.');
            return reply(error);
        }
        if (data){
            return reply(null, Flat.unflatten(data));
        }
        const error = Boom.notFound('The specified entity doesn\'t exists');
        return reply(error);
    });

};
