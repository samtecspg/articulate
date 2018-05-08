'use strict';
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    redis.set('settings:uiLanguage', updateData.uiLanguage, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred updating the ui language.');
            return reply(error);
        }
        return reply(null, Flat.unflatten(updateData));
    });
};
