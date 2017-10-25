'use strict';
const debug = require('debug')('nlu:model:Domain:findByName');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.get({
        index: 'domain',
        type: 'default',
        id: request.params.id
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search domain: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const domain = {};
        domain._id = response._id;
        Object.assign(domain, response._source);

        return reply(null, domain);
    });

};
