'use strict';
const debug = require('debug')('nlu:model:Entity:add');
const _ = require('lodash');
const Guid = require('guid');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');
const EntityTools = require('../tools');

const buildPayload = (entity) => {

    const result = {};

    const id = entity._id ? entity._id : Guid.create().toString();

    //_id is not allowed as it is a system value
    const values = _.clone(entity);
    delete values._id;

    //Create the payload for the bulk command in ES
    result.payload = values;

    //Add _id to the entity to return in the response
    result.entity = Object.assign({ _id: id }, values);

    return result;
};

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

        const entity = request.payload;

        const sentValue = buildPayload(entity);

        request.server.app.elasticsearch.create({
            index: 'entity',
            type: 'default',
            id: sentValue.entity._id,
            body: sentValue.payload
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - add entity: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            return reply(sentValue.entity);
        });
    });
};
