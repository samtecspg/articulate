'use strict';

const Boom = require('boom');
const Wreck = require('wreck');

module.exports = (url, payload, callback) => {

    Wreck.post(url, { payload }, (err, wreckResponse, responsePayload) => {

        if (err){
            const message = 'Error calling webhook with the url ' + url;
            const error = Boom.badImplementation(message);
            return callback(error, null);
        }
        const data = JSON.parse(responsePayload.toString());
        return callback(null, data);
    });
};
