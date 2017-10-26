'use strict';
const debug = require('debug')('nlu:model:Scenario:deleteById');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.delete({
        index: 'scenario',
        type: 'default',
        id: request.params.id
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search scenario: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        return reply({ message: 'successful operation' }).code(200);
    });

};
