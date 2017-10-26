'use strict';
const Boom = require('boom');
const debug = require('debug')('nlu:helpers:belongs');

const fieldsToFilters = (fields) => {

    const filters = Object.keys(fields).map( (field) => {

        const term = { };
        term[field] = fields[field];
        return { term };
    });
    return filters;
};

const belongs = (elasticSearchClient, index, fields, callback) => {

    const filters = fieldsToFilters(fields);
    elasticSearchClient.search({
        index,
        type: 'default',
        body: {
            query: {
                bool: {
                    must: filters
                }
            }
        }
    }, (err, result) => {

        if (err) {
            debug('ElasticSearch - belongs helper: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to check belonging of data');
            return callback(error);
        }
        if (result.hits.hits.length > 0){
            return callback(null);
        }
        const error = Boom.badRequest('The element with values: ' + JSON.stringify(fields, null, 2) + ' does not exists in index ' + index);
        return callback(error);
    });
};

module.exports = belongs;
