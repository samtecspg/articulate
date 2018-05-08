'use strict';
const Boom = require('boom');
const Flat = require('flat');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {

    const redis = request.server.app.redis;

    redis.hgetall('settings:intentClassifierPipeline', (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the intent classifier pipeline.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'pipeline'));
        }
        const error = Boom.notFound('This setting doesn\'t exists');
        return reply(error);
    });

};
