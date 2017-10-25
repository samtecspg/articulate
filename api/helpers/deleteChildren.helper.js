'use strict';
const Boom = require('boom');
const debug = require('debug')('nlu:helpers:delete');

const deleteChildren = (elasticSearchClient, index, fatherLabel, id, callback) => {

    const referencedElement = {};
    referencedElement[fatherLabel] = id;

    elasticSearchClient.deleteByQuery({
        index,
        body: {
            query: {
                bool: {
                    should: [
                        {
                            term: referencedElement
                        }
                    ]
                }
            }
        },
        conflicts: 'proceed'
    }, (err) => {

        if (err) {
            debug('ElasticSearch - delete children helper: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to delete the children of ' + id + ' in index ' + index);
            return callback(error);
        }

        return callback(null);
    });
};

module.exports = deleteChildren;
