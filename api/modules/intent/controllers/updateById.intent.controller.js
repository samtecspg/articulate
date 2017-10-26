'use strict';
const debug = require('debug')('nlu:model:Intent:findById');
const _ = require('lodash');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const Async = require('async');
const IntentTools = require('../tools');

const updateIntent = (elasticsearchClient, id, payload, callback) => {

    elasticsearchClient.update({
        index: 'intent',
        type: 'default',
        id,
        body: {
            doc: payload
        },
        _source: true
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search intent: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return callback(error);
        }

        const intent = {};
        intent._id = response._id;
        Object.assign(intent, response.get._source);

        return callback(null, intent);
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

            let entities = _.map(request.payload.examples, 'entities');
            entities = entities ? _.map(_.flatten(entities), 'entity') : [];
            Async.map(entities, (entity, cb) => {

                IntentTools.validateEntityTool(request.server.app.elasticsearch, request.payload.agent, entity, cb);
            }, callback);
        }
    ], (err) => {

        if (err) {
            return reply(err);
        }

        Async.waterfall([
            Async.apply(updateIntent, request.server.app.elasticsearch, request.params.id, request.payload),
            Async.apply(IntentTools.updateEntitiesTool, request.server.app.elasticsearch),
            (intent, cb) => {

                Async.parallel([
                    Async.apply(IntentTools.retrainModelTool, request.server.app.elasticsearch, request.server.app.rasa, request.server, 'updating', intent),
                    Async.apply(IntentTools.retrainDomainRecognizerTool, request.server.app.elasticsearch, request.server.app.rasa, request.server, 'updating', intent)
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
