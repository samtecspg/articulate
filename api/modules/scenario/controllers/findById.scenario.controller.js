'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const scenarioId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('scenario:' + scenarioId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error ocurred retrieving the scenario.');
            return reply(error);
        }
        if (data){
            return reply(null, Flat.unflatten(data));
        }
        const error = Boom.notFound('The specified scenario doesn\'t exists');
        return reply(error);
    });

};
