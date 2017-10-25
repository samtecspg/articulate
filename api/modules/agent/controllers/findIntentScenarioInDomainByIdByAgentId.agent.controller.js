'use strict';
const debug = require('debug')('nlu:model:Agent:findIntentScenarioByDomainIdByAgentId');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    let size;
    if (request.query && request.query.size){
        size = request.query.size;
    }

    const query = {
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
                            intent: request.params.intentId
                        }
                    }
                ]
            }
        }
    };

    request.server.app.elasticsearch.search({
        index: 'scenario',
        type: 'default',
        body: query,
        size: size ? size : 10
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search scenarios: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }
        const hits = response.hits.hits;
        const scenarios = _.map(hits, (hit) => {

            const tmpScenario = {};
            tmpScenario._id = hit._id;
            Object.assign(tmpScenario, hit._source);
            return tmpScenario;
        });

        return reply(null, scenarios);
    });

};
