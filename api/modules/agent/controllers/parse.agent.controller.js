'use strict';
const Async = require('async');
const debug = require('debug')('nlu:model:Parse:parseText');
const Boom = require('boom');
const AgentTools = require('../tools');

module.exports = (request, reply) => {

    Async.waterfall([
        Async.apply(AgentTools.getAvailableDomains, request.server, request.params.id, null),
        Async.apply(AgentTools.parseText, request.server, request.query.text, request.query.timezone)
    ], (err, parseResult) => {

        if (err){
            return reply(err);
        }

        request.server.app.elasticsearch.create({
            index: 'doc',
            type: 'default',
            id: parseResult.id,
            body: parseResult.result
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - parse document: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            return reply(Object.assign({ _id: response._id }, parseResult.result));
        });
    });
};
