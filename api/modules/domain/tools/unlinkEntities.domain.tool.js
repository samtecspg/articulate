'use strict';
const Boom = require('boom');
const debug = require('debug')('nlu:Domain:tool:unlinkEntities');

const unlinkEntities = (elasticsearchClient, domain, callback) => {

    elasticsearchClient.updateByQuery({
        index: 'entity',
        type: 'default',
        body: {
            query: {
                term: { usedBy: domain }
            },
            script : {
                inline: 'if(ctx._source.usedBy != null) {ctx._source.usedBy.removeAll([params.domain]);}',
                params : {
                    domain
                }
            }
        }
    }, (err) => {

        if (err) {
            debug('ElasticSearch - unlink entities tool: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to validate data');
            return callback(error);
        }

        return callback(null);
    });
};

module.exports = unlinkEntities;
