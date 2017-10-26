'use strict';

const debug = require('debug')('nlu:model:Converse:callWebhook');
const Boom = require('boom');
const Wreck = require('wreck');

module.exports = (url, payload, callback) => {

    Wreck.post(url, { payload }, (err, wreckResponse, responsePayload) => {

        if (err){
            debug('NLU API - converse - callWebhook: Error= %o', err);
            const message = 'Error calling webhook with the url ' + url;
            const error = Boom.badImplementation(message);
            return callback(error, null);
        }
        const data = JSON.parse(responsePayload.toString());
        return callback(null, data);
    });
};
