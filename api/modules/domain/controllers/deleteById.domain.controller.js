'use strict';
const debug = require('debug')('nlu:model:Domaint:deleteById');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const DomainTools = require('../tools');
const Async = require('async');

module.exports = (request, reply) => {

    Async.parallel([
        (callback) => {

            Helpers.deleteChildren(request.server.app.elasticsearch, 'nlu', 'domain', request.params.id, callback);
        },
        (callback) => {

            DomainTools.unlinkEntities(request.server.app.elasticsearch, request.params.id, callback);
        }
    ], (err) => {

        if (err) {
            return reply(err);
        }

        request.server.app.elasticsearch.delete({
            index: 'domain',
            type: 'default',
            id: request.params.id
        }, (deleteErr, response) => {

            if (deleteErr){
                debug('ElasticSearch - delete domain: Error= %o', deleteErr);
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
