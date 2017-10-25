'use strict';
const debug = require('debug')('nlu:model:Domain:add');
const _ = require('lodash');
const Guid = require('guid');
const Boom = require('boom');
const Helpers = require('../../../helpers');

const buildPayload = (domain) => {

    const result = {};

    const id = Guid.create().toString();

    //_id is not allowed as it is a system value
    const values = _.clone(domain);
    delete values._id;

    //Create the payload for the bulk command in ES
    result.payload = values;

    //Add _id to the domain to return in the response
    result.domain = Object.assign({ _id: id }, values);

    return result;
};

module.exports = (request, reply) => {

    Helpers.exists(request.server.app.elasticsearch, 'agent', request.payload.agent, (err) => {

        if (err){
            return reply(err, null);
        }

        const domain = request.payload;

        const sentValue = buildPayload(domain);

        request.server.app.elasticsearch.create({
            index: 'domain',
            type: 'default',
            id: sentValue.domain._id,
            body: sentValue.payload
        }, (err, response) => {

            if (err){
                debug('ElasticSearch - add domain: Error= %o', err);
                const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
                if (err.body){
                    error.output.payload.details = error.data;
                }
                return reply(error);
            }

            return reply(sentValue.domain);
        });
    });
};
