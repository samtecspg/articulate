'use strict';
const debug = require('debug')('nlu:model:Intent:tool:getDomainData');
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

const countOfElementsInFather = (elasticsearch, father, callback) => {

    const term = {};
    term[father.key] = father.value;

    const should = [
        {
            term
        }
    ];

    if (father.key === 'domain'){
        should.push({
            term: {
                usedBy: father.value
            }
        });
    }

    elasticsearch.count({
        index: 'domain-data',
        body: {
            query: {
                bool: {
                    should
                }
            }
        }
    }, (err, result) => {

        if (err) {
            debug('ElasticSearch - belongs helper: Error= %o', err);
            const error = Boom.badImplementation('An error ocurred calling ES to count father data');
            return callback(error);
        }

        return callback(null, result.count);
    });
};

const getElementsInFather = (elasticsearch, father, size, callback) => {

    const term = {};
    term[father.key] = father.value;

    const should = [
        {
            term
        }
    ];

    if (father.key === 'domain'){
        should.push({
            term: {
                usedBy: father.value
            }
        });
    }

    elasticsearch.search({
        index: 'domain-data',
        body: {
            query: {
                bool: {
                    should
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

const getDomainData = (elasticsearch, intent, action, domainRecognitionTraining, callback) => {

    const father = {
        key: domainRecognitionTraining ? 'agent' : 'domain',
        value: domainRecognitionTraining ? intent.agent : intent.domain
    };

    Async.waterfall([
        Async.apply(countOfElementsInFather,elasticsearch, father),
        Async.apply(getElementsInFather,elasticsearch, father)
    ], (err, results) => {

        if (err){
            return callback(err, null);
        }

        if (domainRecognitionTraining){
            results = _.filter(results, (result) => {

                return result._id !== father.value + '-domain-recognizer';
            });
        }

        switch (action) {
            case 'adding':
                results.push({
                    _id: intent._id,
                    _index: 'intent',
                    _source: intent
                });
                break;
            case 'updating':
                results = _.filter(results, (result) => {

                    return result._id !== intent._id;
                });
                results.push({
                    _id: intent._id,
                    _index: 'intent',
                    _source: intent
                });
                break;
            case 'deleting':
                results = _.filter(results, (result) => {

                    return result._id !== intent._id;
                });
                break;
            default:
                break;
        }

        const entities = _.filter(results, (result) => {

            return result._index === 'entity';
        });

        const intents = _.filter(results, (result) => {

            return result._index === 'intent';
        });

        return callback(null, { entities, intents });
    });

};

module.exports = getDomainData;
