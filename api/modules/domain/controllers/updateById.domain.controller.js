'use strict';
const debug = require('debug')('nlu:model:Domain:updateById');
const Boom = require('boom');
const Helpers = require('../../../helpers');

module.exports = (request, reply) => {

    Helpers.exists(request.server.app.elasticsearch, 'agent', request.payload.agent, (err) => {

        if (err){
            return reply(err, null);
        }

        request.server.app.elasticsearch.update({
            index: 'domain',
            type: 'default',
            id: request.params.id,
            body: {
                doc: request.payload
            },
            _source: true
        }, (updateErr, response) => {

            if (updateErr){
                debug('ElasticSearch - update domain: Error= %o', updateErr);
                if (updateErr.statusCode === 404){
                    const notFound = Boom.notFound('The specified domain doesn\'t exists');
                    return reply(notFound);
                }
                const error = Boom.create(updateErr.statusCode, updateErr.message, updateErr.body ? updateErr.body : null);
                if (updateErr.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            const domain = {};
            domain._id = response._id;
            Object.assign(domain, response.get._source);

            return reply(null, domain);
        });
    });
};
