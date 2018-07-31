'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const keywordId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall('keyword:' + keywordId, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the keyword.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'keyword'));
        }
        const error = Boom.notFound('The specified keyword doesn\'t exists');
        return reply(error);
    });

};
