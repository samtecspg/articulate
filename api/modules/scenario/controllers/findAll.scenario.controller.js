'use strict';
const Boom = require('boom');
const debug = require('debug')('nlu:model:Scenario:findAll');
const _ = require('lodash');

module.exports = (request, reply) => {

    let size;
    if (request.query && request.query.size){
        size = request.query.size;
    }

    request.server.app.elasticsearch.search({
        index: 'scenario',
        type: 'default',
        body: { query: { match_all: {} } },
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
