'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    redis.hmset('settings:entityClassifierPipeline', Flat(updateData), (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred updating the entity classifier pipeline.');
            return reply(error);
        }
        return reply(null, updateData);
    });
};
