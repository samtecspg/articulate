'use strict';
const debug = require('debug')('nlu:model:Agent:deleteById');
const Boom = require('boom');
const Helpers = require('../../../helpers');

module.exports = (request, reply) => {

    Helpers.deleteChildren(request.server.app.elasticsearch, 'nlu', 'agent', request.params.id, (err) => {

        if (err){
            return reply(err);
        }

        request.server.app.elasticsearch.delete({
            index: 'agent',
            type: 'default',
            id: request.params.id
        }, (deleteErr, response) => {

            if (deleteErr){
                debug('ElasticSearch - delete agent: Error= %o', deleteErr);
                const error = Boom.create(deleteErr.statusCode, deleteErr.message, deleteErr.body ? deleteErr.body : null);
                if (deleteErr.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            return reply({ message: 'successful operation' }).code(200);
        });
    });

};
