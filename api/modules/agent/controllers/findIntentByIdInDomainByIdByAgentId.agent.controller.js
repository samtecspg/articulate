'use strict';
const debug = require('debug')('nlu:model:Agent:findIntentByIdByDomainIdByAgentId');
const Boom = require('boom');

module.exports = (request, reply) => {

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
                        },
                        {
                            term: {
                                _id: request.params.intentId
                            }
                        }
                    ]
                }
            }
        }
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
        const intent = hits[0];

        if (intent){
            const tmpIntent = {};
            tmpIntent._id = intent._id;
            Object.assign(tmpIntent, intent._source);
            return reply(null, tmpIntent);
        }

        const nonexistent = Boom.notFound('The specified intent doesn\'t exists for the given agent');
        return reply(nonexistent);
    });

};
