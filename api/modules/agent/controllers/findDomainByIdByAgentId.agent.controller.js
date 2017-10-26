'use strict';
const debug = require('debug')('nlu:model:Agent:findDomainByIdByAgentId');
const Boom = require('boom');

module.exports = (request, reply) => {

    request.server.app.elasticsearch.search({
        index: 'domain',
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
                                _id: request.params.domainId
                            }
                        }
                    ]
                }
            }
        }
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search domains: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const hits = response.hits.hits;
        const domain = hits[0];

        if (domain){
            const tmpDomain = {};
            tmpDomain._id = domain._id;
            Object.assign(tmpDomain, domain._source);
            return reply(null, tmpDomain);
        }

        const nonexistent = Boom.notFound('The specified domain doesn\'t exists for the given agent');
        return reply(nonexistent);
    });

};
