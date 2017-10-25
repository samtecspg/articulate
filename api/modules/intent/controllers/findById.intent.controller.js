'use strict';
const debug = require('debug')('nlu:model:Intent:findById');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.get({
        index: 'intent',
        type: 'default',
        id: request.params.id
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search intent: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const intent = {};
        intent._id = response._id;
        Object.assign(intent, response._source);

        return reply(null, intent);
    });

};
