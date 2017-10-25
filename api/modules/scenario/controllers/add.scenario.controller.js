'use strict';
const debug = require('debug')('nlu:model:Scenario:add');
const _ = require('lodash');
const Guid = require('guid');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');

const buildPayload = (scenario) => {

    const result = {};

    const id = scenario._id ? scenario._id : Guid.create().toString();

    //_id is not allowed as it is a system value
    const values = _.clone(scenario);
    delete values._id;

    //Create the payload for the bulk command in ES
    result.payload = values;

    //Add _id to the scenario to return in the response
    result.scenario = Object.assign({ _id: id }, values);

    return result;
};

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
        }/*,
        (callback) => {

            const fields = {
                agent: request.payload.agent,
                domain: request.payload.domain,
                _id: request.payload.intent
            };
            Helpers.belongs(request.server.app.elasticsearch, 'intent', fields, callback);
        }*/
    ], (err) => {

        if (err) {
            return reply(err);
        }

        const scenario = request.payload;

        const sentValue = buildPayload(scenario);

        request.server.app.elasticsearch.create({
            index: 'scenario',
            type: 'default',
            id: sentValue.scenario._id,
            body: sentValue.payload
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - add scenario: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            //There aren't errors, return the passed scenario with the _id
            return reply(sentValue.scenario);
        });
    });
};
