'use strict';
const debug = require('debug')('nlu:model:Agent:findEntityByIdByAgentId');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.search({
        index: 'entity',
        type: 'default',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                agent: request.params.id
                            },
                            term: {
                                _id: request.params.entityId
                            }
                        }
                    ]
                }
            }
        }
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search entity by id: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const hits = response.hits.hits;
        const entity = hits[0];

        if (entity){
            const tmpEntity = {};
            tmpEntity._id = entity._id;
            Object.assign(tmpEntity, entity._source);
            return reply(null, tmpEntity);
        }

        const nonexistent = Boom.notFound('The specified entity doesn\'t exists for the given agent');
        return reply(nonexistent);
    });

};
