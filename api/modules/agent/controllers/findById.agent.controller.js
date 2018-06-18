'use strict';
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('agent:' + agentId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the agent.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'agent'));
        }
        const error = Boom.notFound('The specified agent doesn\'t exists');
        return reply(error);
    });

};
