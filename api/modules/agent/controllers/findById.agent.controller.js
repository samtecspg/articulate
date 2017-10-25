'use strict';
const debug = require('debug')('nlu:model:Agent:findByName');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.get({
        index: 'agent',
        type: 'default',
        id: request.params.id
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search agent: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const agent = {};
        agent._id = response._id;
        Object.assign(agent, response._source);

        return reply(null, agent);
    });

};
