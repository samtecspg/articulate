'use strict';
const debug = require('debug')('nlu:model:Agent:findEntitiesByAgentId');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    let size;
    if (request.query && request.query.size){
        size = request.query.size;
    }

    request.server.app.elasticsearch.search({
        index: 'entity',
        type: 'default',
        body: { query: { term: { agent: request.params.id } } },
        size: size ? size : 10
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search entities: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const hits = response.hits.hits;
        const entities = _.map(hits, (hit) => {

            const tmpEntity = {};
            tmpEntity._id = hit._id;
            Object.assign(tmpEntity, hit._source);
            return tmpEntity;
        });

        return reply(null, entities);
    });

};
