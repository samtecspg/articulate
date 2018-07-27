'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

//TODO: PATH 1.1.2.1
module.exports = (request, reply) => {

    const domainId = request.params.id;
    const redis = request.server.app.redis;

    //TODO: PATH 1.1.2.1.1
    redis.hgetall('domain:' + domainId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the domain.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'domain'));
        }
        const error = Boom.notFound('The specified domain doesn\'t exists');
        return reply(error);
    });

};
