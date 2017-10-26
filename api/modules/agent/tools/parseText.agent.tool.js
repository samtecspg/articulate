'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Crypto = require('crypto');
const debug = require('debug')('nlu:model:Parse:findAll');
const Wreck = require('wreck');
const Querystring = require('querystring');

const DucklingOutputToIntervals = require('./ducklingOutputToInterval.agent.tool');

const getRasaParse = (textToParse, trainedDomain, server, callback) => {

    const requestPayload = {
        q: textToParse,
        model: trainedDomain.model
    };

    Wreck.post(server.app.rasa + '/parse', { payload: requestPayload, json: true }, (err, wreckResponse, payload) => {

        if (err){
            debug('ElasticSearch - parse text rasa: Error= %o', err);
            const message = 'Error calling rasa to parse text on domain ' + trainedDomain.name;
            const error = Boom.badImplementation(message);
            return callback(error, null);
        }

        delete payload.text;
        const temporalParse = {
            domain: trainedDomain.name
        };

        return callback(null, Object.assign(temporalParse, payload));
    });
};

const getDucklingParse = (textToParse, timezone, server, callback) => {

    timezone = timezone ? timezone : 'America/Kentucky/Louisville';
    const ducklingPayload = {
        text: textToParse,
        lang: 'en',
        tz: timezone
    };

    Wreck.post(server.app.duckling + '/parse', {
        payload: Querystring.stringify(ducklingPayload),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: 'force'
    }, (err, wreckResponse, payload) => {

        if (err){
            debug('NLU API - parse text duckling: Error= %o', err);
            const message = 'Error calling duckling to parse text';
            const error = Boom.badImplementation(message);
            return callback(error, null);
        }

        //The value in the result is not formatted as JSON. This formats that value
        payload = _.map(payload, (ducklingResult) => {

            ducklingResult.value = JSON.parse(ducklingResult.value);
            return ducklingResult;
        });

        payload = DucklingOutputToIntervals(payload, timezone);
        return callback(null, payload);
    });
};

const replacer = (key, value) => {

    if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return value.toString();
    }
    return value;
};

const getSysEntities = (parseResult) => {

    const ducklingEntities = _.map(parseResult.duckling, (entity) => {

        const tmpEntity = {
            end: entity.end,
            entity: 'sys.duckling_' + entity.dim,
            extractor: 'duckling',
            start: entity.start,
            value: JSON.parse(JSON.stringify(entity.value, replacer))
        };
        return tmpEntity;
    });

    parseResult.rasa = _.map(parseResult.rasa, (rasaResult) => {

        const rasaEntities = _.map(rasaResult.entities, (entity) => {

            if (entity.extractor === 'ner_spacy'){
                entity.entity = 'sys.spacy_' + entity.entity.toLowerCase();
            }
            entity.value = { value: entity.value };
            return entity;
        });

        rasaResult.entities = _.union(rasaEntities, ducklingEntities);

        return rasaResult;
    });

    delete parseResult.duckling;

    return parseResult.rasa;
};

const parseText = (server, textToParse, timezone, trainedDomains, cb) => {

    Async.parallel({
        rasa: (callback) => {

            Async.map(trainedDomains, (trainedDomain, callbk) => {

                const start = process.hrtime();
                getRasaParse(textToParse, trainedDomain, server, (err, result) => {

                    if (err){
                        return callbk(err, null);
                    }
                    const time = process.hrtime(start);
                    result = Object.assign(result, { elapsed_time_ms: time[1] / 1000000 });
                    return callbk(null, result);
                });

            }, (err, parsingResults) => {

                if (err){
                    return callback(err, null);
                }

                return callback(null, parsingResults);
            });
        },
        duckling: (callback) => {

            const start = process.hrtime();
            getDucklingParse(textToParse, timezone, server, (err, result) => {

                if (err){
                    return callback(err, null);
                }
                const time = process.hrtime(start);
                result = _.map(result, (ducklingParse) => {

                    return Object.assign(ducklingParse, { elapsed_time_ms: time[1] / 1000000 / result.length });
                });
                return callback(null, result);
            });
        }
    }, (err, result) => {

        if (err){
            return cb(err, null);
        }

        const parsedDate = new Date();

        result = getSysEntities(result);

        const temporalParse = {
            id: Crypto.createHash('md5').update(textToParse + parsedDate.toISOString()).digest('hex'),
            result: {
                document: textToParse,
                time_stamp: parsedDate.toISOString(),
                results: result
            }
        };
        return cb(null, temporalParse);
    });
};

module.exports = (server, textToParse, timezone, trainedDomains, cb) => {

    const start = process.hrtime();
    parseText(server, textToParse, timezone, trainedDomains, (err, result) => {

        if (err){

            return cb(err, null);
        }
        const time = process.hrtime(start);
        const max_intent_score = _.max(_.compact(_.map(_.map(result.result.results.rasa, 'intent'), 'confidence')));
        result.result = Object.assign(result.result, { maximum_intent_score: max_intent_score, total_elapsed_time_ms: time[1] / 1000000 });
        return cb(null, result);
    });
};
