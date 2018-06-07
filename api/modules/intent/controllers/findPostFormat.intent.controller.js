'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const intentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall(`intentPostFormat:${intentId}`, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the post format.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'postFormat'));
        }
        const error = Boom.notFound('The specified post format doesn\'t exists');
        return reply(error);
    });

};
