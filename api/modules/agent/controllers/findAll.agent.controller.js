'use strict';
const debug = require('debug')('nlu:model:Agent:findAll');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    let size;
    if (request.query && request.query.size){
        size = request.query.size;
    }

    request.server.app.elasticsearch.search({
        index: 'agent',
        type: 'default',
        body: { query: { match_all: {} } },
        size: size ? size : 10
    }, (err, response) => {

        if (err){
            debug('ElasticSearch - search agents: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return reply(error);
        }

        const hits = response.hits.hits;
        const agents = _.map(hits, (hit) => {

            const tmpAgent = {};
            tmpAgent._id = hit._id;
            Object.assign(tmpAgent, hit._source);
            return tmpAgent;
        });

        return reply(null, agents);
    });

};
