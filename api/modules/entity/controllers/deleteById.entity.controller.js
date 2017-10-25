'use strict';
const debug = require('debug')('nlu:model:Entity:deleteById');
const Boom = require('boom');
const EntityTools = require('../tools');

module.exports = (request, reply) => {

    EntityTools.checkLinkWithIntent(request.server.app.elasticsearch, request.params.id, (err) => {

        if (err){
            return reply(err);
        }

        request.server.app.elasticsearch.delete({
            index: 'entity',
            type: 'default',
            id: request.params.id
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - search entity: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            return reply({ message: 'successful operation' }).code(200);
        });

    });

};
