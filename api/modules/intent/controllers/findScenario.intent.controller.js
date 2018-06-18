'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall(`scenario:${intentId}`, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the scenario.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'scenario'));
        }
        const error = Boom.notFound('The specified scenario doesn\'t exists');
        return reply(error);
    });

};
