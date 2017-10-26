'use strict';
const debug = require('debug')('nlu:model:Scenario:findById');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.get({
        index: 'scenario',
        type: 'default',
        id: request.params.id
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
        Object.assign(scenario, response._source);

        return reply(null, scenario);
    });

};
