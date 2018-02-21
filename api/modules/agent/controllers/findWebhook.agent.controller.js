'use strict';
const Boom = require('boom');
const Flat = require('flat');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {

    const agentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall(`agentWebhook:${agentId}`, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the webhook.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'webhook'));
        }
        const error = Boom.notFound('The specified webhook doesn\'t exists');
        return reply(error);
    });

};
