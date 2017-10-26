'use strict';
const Boom = require('boom');

const checkLinkWithIntent = (elasticsearchClient, entity, callback) => {

    elasticsearchClient.search({
        index: 'intent',
        type: 'default',
        body: {
            query: {
                term: {
                    'examples.entities.entity': entity
                }
            }
        }
    }, (err, results) => {

        if (err){
            debug('ElasticSearch - search links with intents: Error= %o', err);
            const error = Boom.create(err.statusCode, err.message, err.body ? err.body : null);
            if (err.body){
                error.output.payload.details = error.data;
            }
            return callback(error);
        }

        if (results.hits.hits.length > 0){
            const error = Boom.badRequest('The specified entity is linked with one or more intents');
            return callback(error);
        }

        return callback(null);
    });
};

module.exports = checkLinkWithIntent;
