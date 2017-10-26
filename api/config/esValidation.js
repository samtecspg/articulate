'use strict';
const _ = require('lodash');
const NLUIndexexStructures = require('./nluIndexexStructures');
const Async = require('async');

const createNLUIndex = (elasticSearchClient, indexStructure, callback) => {

    elasticSearchClient.indices.create({
        index: indexStructure.name,
        body: { mappings: indexStructure.mappings }
    }, (err, response) => {

        if (err) {
            return callback(err, null);
        }
        return callback(null, true);
    });
};

const createIndicesAlias = (elasticSearchClient, indices, alias, callback) => {

    elasticSearchClient.indices.putAlias({
        index: indices,
        name: alias
    }, (err, response) => {

        if (err) {
            return callback(err, null);
        }
        return callback(null);
    });
};

const validateSingleIndex = (elasticSearchClient, indexStructure, cb) => {

    let validIndex = false;

    elasticSearchClient.indices.get({
        index: indexStructure.name
    }, (err, response) => {

        if (err) {
            if (err.status === 404){
                createNLUIndex(elasticSearchClient, indexStructure, (creationErr, result) => {

                    if (creationErr){
                        return cb(creationErr, null);
                    }

                    validIndex = result ? result : validIndex;
                    return cb(null, validIndex);
                });
            }
            else {
                return cb(err, null);
            }
        }
        else {
            const index = response[indexStructure.name];
            const indexMappings = index ? response[indexStructure.name].mappings : undefined;
            validIndex = {
                index: indexStructure.name,
                valid: response && index && indexMappings ? _.isEqual(indexMappings, indexStructure.mappings) : validIndex
            };
            return cb(null, validIndex);
        }
    });
};

const EsValidation = {

    validate: (elasticSearchClient, cb) => {

        Async.map(NLUIndexexStructures, (indexStructure, callback) => {

            validateSingleIndex(elasticSearchClient, indexStructure, (err, result) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, result);
            });

        }, (err, results) => {

            if (err){
                return cb(err, null);
            }

            const boolResults = _.map(results, 'valid');
            const invalidIndex = boolResults.indexOf(false) !== -1 ? results[boolResults.indexOf(false)] : null;

            if (invalidIndex) {
                return cb(null, invalidIndex);
            }

            Async.parallel([
                (callbk) => {

                    createIndicesAlias(elasticSearchClient, _.map(NLUIndexexStructures, 'name'), 'nlu', callbk);
                },
                (callbk) => {

                    createIndicesAlias(elasticSearchClient, ['entity', 'intent'], 'domain-data', callbk);
                }
            ], (errAliases) => {

                if (errAliases){
                    return cb(errAliases, null);
                }

                return cb(null, null);
            });

        });
    }
};

module.exports = EsValidation;
