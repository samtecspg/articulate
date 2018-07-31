'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const sayingId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('saying:' + sayingId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the saying.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'saying'));
        }
        const error = Boom.notFound('The specified saying doesn\'t exists');
        return reply(error);
    });

};
