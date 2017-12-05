'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const domainId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('domain:' + domainId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error ocurred retrieving the domain.');
            return reply(error);
        }
        if (data){
            return reply(null, Flat.unflatten(data));
        }
        const error = Boom.notFound('The specified domain doesn\'t exists');
        return reply(error);
    });

};
