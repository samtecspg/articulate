'use strict';
const debug = require('debug')('nlu:model:Agent:updateById');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.update({
        index: 'agent',
        type: 'default',
        id: request.params.id,
        body: {
            doc: request.payload
        },
        _source: true
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - update agent: Error= %o', err);
            if (err.statusCode === 404){
                const notFound = Boom.notFound('The specified agent doesn\'t exists');
                return reply(notFound);
            }
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const agent = {};
        agent._id = response._id;
        Object.assign(agent, response.get._source);

        return reply(null, agent);
    });

};
