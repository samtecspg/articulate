'use strict';
const debug = require('debug')('nlu:model:Agent:findIntentsInDomainByidByAgentId');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    let size;
    if (request.query && request.query.size){
        size = request.query.size;
    }

    request.server.app.elasticsearch.search({
        index: 'intent',
        type: 'default',
        body: {
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                agent: request.params.id
                            }
                        },
                        {
                            term: {
                                domain: request.params.domainId
                            }
                        }
                    ]
                }
            }
        },
        size: size ? size : 10
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search intents: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const hits = response.hits.hits;
        const intents = _.map(hits, (hit) => {

            const tmpIntent = {};
            tmpIntent._id = hit._id;
            Object.assign(tmpIntent, hit._source);
            return tmpIntent;
        });

        return reply(null, intents);
    });

};
