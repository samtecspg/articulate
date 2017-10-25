'use strict';
const debug = require('debug')('nlu:model:Intent:deleteById');
const Boom = require('boom');
const Helpers = require('../../../helpers');
const IntentTools = require('../tools');
const Async = require('async');

const getIntent = (intentId, server, callback) => {

    const options = {
        url: '/intent/' + intentId,
        method: 'GET'
    };

    server.inject(options, (res) => {

        if (res.statusCode !== 200) {
            return callback(res.result, null);
        }
        return callback(null, res.result);
    });
};

const deleteIntent = (elasticsearch, intent, callback) => {

    Helpers.deleteChildren(elasticsearch, 'scenario', 'intent', intent._id, (err) => {

        if (err){
            return callback(err);
        }

        elasticsearch.delete({
            index: 'intent',
            type: 'default',
            id: intent._id
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - search intent: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return callback(error);
            }

            return callback(null, { message: 'successful operation' }, intent);
        });
    });
};

const retrainModel = (elasticsearch, rasa, server, action, deleteResponse, intent, callback) => {

    IntentTools.retrainModelTool(elasticsearch, rasa, server, action, intent, (err, result) => {

        if (err){
            return callback(err, deleteResponse);
        }
        return callback(null, deleteResponse);
    });
};

module.exports = (request, reply) => {

    Async.waterfall([
        Async.apply(getIntent, request.params.id, request.server),
        Async.apply(deleteIntent,request.server.app.elasticsearch),
        Async.apply(retrainModel, request.server.app.elasticsearch, request.server.app.rasa, request.server, 'deleting')
    ], (err, response) => {

        if (err && !response){
            if (err.statusCode) {
                return reply(err).code(err.statusCode);
            }
            return reply(err);
        }
        return reply(response).code(200);
    });
};
