'use strict';
const debug = require('debug')('nlu:model:Intent:add');
const _ = require('lodash');
const Guid = require('guid');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');
const IntentTools = require('../tools');

const buildPayload = (intent) => {

    const result = {};

    const id = intent._id ? intent._id : Guid.create().toString();

    //_id is not allowed as it is a system value
    const values = _.clone(intent);
    delete values._id;

    //Create the payload for the bulk command in ES
    result.payload = values;

    //Add _id to the intent to return in the response
    result.intent = Object.assign({ _id: id }, values);

    return result;
};

const createIntent = (elasticsearchClient, payload, callback) => {

    const intent = payload;

    const sentValue = buildPayload(intent);

    elasticsearchClient.create({
        index: 'intent',
        type: 'default',
        id: sentValue.intent._id,
        body: sentValue.payload
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - add intent: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return callback(error, null);
        }

        //There aren't errors, return the passed intent with the _id
        return callback(null, sentValue.intent);
    });
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

            const fields = {
                agent: request.payload.agent,
                _id: request.payload.domain
            };
            Helpers.belongs(request.server.app.elasticsearch, 'domain', fields, callback);
        },
        (callback) => {

            let entities = _.compact(_.map(request.payload.examples, 'entities'));
            entities = entities ? _.map(_.flatten(entities), 'entity') : [];
            Async.map(entities, (entity, cb) => {

                IntentTools.validateEntityTool(request.server.app.elasticsearch, request.payload.agent, entity, cb);
            }, callback);
        }
    ], (validationErr) => {

        if (validationErr) {
            return reply(validationErr);
        }

        Async.waterfall([
            Async.apply(createIntent, request.server.app.elasticsearch, request.payload),
            Async.apply(IntentTools.updateEntitiesTool, request.server.app.elasticsearch),
            (intent, cb) => {

                Async.parallel([
                    Async.apply(IntentTools.retrainModelTool, request.server.app.elasticsearch, request.server.app.rasa, request.server, 'adding', intent),
                    Async.apply(IntentTools.retrainDomainRecognizerTool, request.server.app.elasticsearch, request.server.app.rasa, request.server, 'adding', intent)
                ], (err) => {

                    if (err){
                        return cb(err, null);
                    }
                    return cb(null, intent);
                });
            }
        ], (err, intent) => {

            if (err) {
                return reply(err);
            }

            return reply(null, intent);
        });
    });

};
