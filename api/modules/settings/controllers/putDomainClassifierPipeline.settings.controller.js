'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    redis.hmset('settings:domainClassifierPipeline', Flat(updateData), (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred updating the domain classifier pipeline.');
            return reply(error);
        }
        return reply(null, updateData);
    });
};
