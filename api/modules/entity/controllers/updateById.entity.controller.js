'use strict';
const debug = require('debug')('nlu:model:Entity:findById');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');
const EntityTools = require('../tools');

module.exports = (request, reply) => {

    Async.parallel([
        (callback) => {

            Helpers.exists(request.server.app.elasticsearch, 'agent', request.payload.agent, callback);
        },
        (callback) => {

            Async.map(request.payload.usedBy, (domain, cb) => {

                EntityTools.validateDomainTool(request.server.app.elasticsearch, request.payload.agent, domain, cb);
            }, callback);
        }
    ], (err) => {

        if (err){
            return reply(err, null);
        }

        request.server.app.elasticsearch.update({
            index: 'entity',
            type: 'default',
            id: request.params.id,
            body: {
                doc: request.payload
            },
            _source: true
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - update entity: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            const entity = {};
            entity._id = response._id;
            Object.assign(entity, response.get._source);

            return reply(null, entity);
        });
    });

};
