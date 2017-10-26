'use strict';
const debug = require('debug')('nlu:model:Scenario:findById');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');

module.exports = (request, reply) => {

    Async.parallel([
        (callback) => {

            Helpers.exists(request.server.app.elasticsearch, 'agent', request.payload.agent, callback);
        },
        (callback) => {

            Helpers.exists(request.server.app.elasticsearch, 'domain', request.payload.domain, callback);
        },
        (callback) => {

            Helpers.exists(request.server.app.elasticsearch, 'intent', request.payload.intent, callback);
        },
        (callback) => {

            const fields = {
                agent: request.payload.agent,
                domain: request.payload.domain,
                _id: request.payload.intent
            };
            Helpers.belongs(request.server.app.elasticsearch, 'intent', fields, callback);
        }
    ], (err) => {

        if (err) {
            return reply(err);
        }

        request.server.app.elasticsearch.update({
            index: 'scenario',
            type: 'default',
            id: request.params.id,
            body: {
                doc: request.payload
            },
            _source: true
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - search scenario: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            const scenario = {};
            scenario._id = response._id;
            Object.assign(scenario, response.get._source);

            return reply(null, scenario);
        });
    });

};
