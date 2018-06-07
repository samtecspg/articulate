'use strict';
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('../../../helpers/flat');

module.exports = (request, reply) => {

    const documentId = request.params.id;
    const redis = request.server.app.redis;

    redis.hgetall(`document:${documentId}`, (err, data) => {

        if (err){
            const error = Boom.badImplementation('An error occurred retrieving the document.');
            return reply(error);
        }
        if (data){
            return reply(null, Cast(Flat.unflatten(data), 'document'));
        }
        const error = Boom.notFound('The specified document doesn\'t exists');
        return reply(error);
    });

};
