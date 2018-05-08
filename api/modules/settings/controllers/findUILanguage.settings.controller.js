'use strict';
const Boom = require('boom');

module.exports = (request, reply) => {

    const redis = request.server.app.redis;

    redis.get('settings:uiLanguage', (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the ui language.');
            return reply(error);
        }
        if (data){
            return reply(null, {
                uiLanguage: data
            });
        }
        const error = Boom.notFound('This setting doesn\'t exists');
        return reply(error);
    });

};
