'use strict';
const debug = require('debug')('nlu:model:Agent:add');
const _ = require('lodash');
const Guid = require('guid');
const Boom = require('boom');

const buildPayload = (agent) => {

    const result = {};

    const id = Guid.create().toString();

    //_id is not allowed as it is a system value
    const values = _.clone(agent);
    delete values._id;

    //Create the payload for the bulk command in ES
    result.payload = values;

    //Add _id to the agent to return in the response
    result.agent = Object.assign({ _id: id }, values);

    return result;
};

module.exports = (request, reply) => {

    const agent = request.payload;

    const sentValue = buildPayload(agent);

    request.server.app.elasticsearch.create({
        index: 'agent',
        type: 'default',
        id: sentValue.agent._id,
        body: sentValue.payload
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - add agent: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        return reply(sentValue.agent);
    });
};
