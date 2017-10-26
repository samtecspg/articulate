'use strict';
const debug = require('debug')('nlu:model:Intent:tool:getDomainData');
const Async = require('async');
const Boom = require('boom');

const countOfElementsInAgent = (elasticsearch, agent, callback) => {

    elasticsearch.count({
        index: 'nlu',
        body: {
            query: {
                bool: {
                    should: [
                        {
                            term: {
                                agent
                            }
                        },
                        {
                            term: {
                                _id: agent
                            }
                        }
                    ]
                }
            }
        }
    }, (err, result) => {

        if (err) {
            debug('ElasticSearch - count elements in agent: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to count agent data');
            return callback(error);
        }

        return callback(null, result.count);
    });
};

const getElementsInAgent = (elasticsearch, agent, size, callback) => {

    elasticsearch.search({
        index: 'nlu',
        body: {
            query: {
                bool: {
                    should: [
                        {
                            term: {
                                agent
                            }
                        },
                        {
                            term: {
                                _id: agent
                            }
                        }
                    ]
                }
            }
        },
        size
    }, (err, result) => {

        if (err) {
            debug('ElasticSearch - belongs helper: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to get father data');
            return callback(error, null);
        }

        return callback(null, result.hits.hits);
    });
};

const loadAgentData = (elasticsearch, agent, callback) => {

    Async.waterfall([
        Async.apply(countOfElementsInAgent,elasticsearch, agent),
        Async.apply(getElementsInAgent,elasticsearch, agent)
    ], (err, results) => {

        if (err){
            return callback(err, null);
        }

        return callback(null, results);
    });

};

module.exports = loadAgentData;
