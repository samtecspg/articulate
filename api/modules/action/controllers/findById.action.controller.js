'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const actionId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('action:' + actionId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the action.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'action'));
        }
        const error = Boom.notFound('The specified action doesn\'t exists');
        return reply(error);
    });

};
