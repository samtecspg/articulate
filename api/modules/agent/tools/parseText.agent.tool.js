'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Wreck = require('wreck');
const Querystring = require('querystring');

const DucklingOutputToIntervals = require('./ducklingOutputToInterval.agent.tool');

const getRasaParse = (textToParse, trainedDomain, agentName, rasa_er, rasa, callback) => {

    const requestPayload = {
        q: textToParse,
        project: agentName,
        model: trainedDomain.model
    };

    let rasaService = rasa;
    if (trainedDomain.justER){
        rasaService = rasa_er;
    }

    Wreck.post(rasaService + '/parse', { payload: requestPayload, json: true }, (err, wreckResponse, result) => {

        if (err){
            const error = Boom.badImplementation(`Error calling rasa to parse text on domain ${trainedDomain.name}`);
            return callback(error, null);
        }

        delete result.text;
        const temporalParse = {
            domain: trainedDomain.name
        };
        if (trainedDomain.justER){
            result.intent.name = trainedDomain.intent;
            result.intent.confidence = 1;
        }

        return callback(null, Object.assign(temporalParse, result));
    });
};

const getDucklingParse = (textToParse, timezone, language, ducklingService, callback) => {

    const ducklingPayload = {
        text: textToParse,
        lang: (language ? language : 'en'),
        tz: timezone
    };

    Wreck.post(ducklingService + '/parse', {
        payload: Querystring.stringify(ducklingPayload),
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        json: 'force'
    }, (err, wreckResponse, payload) => {

        if (err){
            const error = Boom.badImplementation('Error calling duckling to parse text');
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

const castSysEntities = (parseResult) => {

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

const parseText = (redis, rasa_er, rasa, ducklingService, textToParse, timezone, agentData, cb) => {

    Async.parallel({
        rasa: (callback) => {

            Async.map(agentData.trainedDomains, (trainedDomain, callbk) => {

                const start = process.hrtime();
                getRasaParse(textToParse, trainedDomain, agentData.agent.agentName, rasa_er, rasa, (err, result) => {

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
            getDucklingParse(textToParse, timezone, 'en', ducklingService, (err, result) => {

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

        result = castSysEntities(result);

        const temporalParse = {
            result: {
                document: textToParse,
                time_stamp: parsedDate.toISOString(),
                results: result
            }
        };
        return cb(null, temporalParse);
    });
};

module.exports = (redis, rasa_er, rasa, duckling, textToParse, timezone, agentData, cb) => {

    const start = process.hrtime();
    parseText(redis, rasa_er, rasa, duckling, textToParse, timezone, agentData, (err, result) => {

        if (err){
            return cb(err, null);
        }
        const time = process.hrtime(start);
        const max_intent_score = _.max(_.compact(_.map(_.map(result.result.results, 'intent'), 'confidence')));
        result.result = Object.assign(result.result, { maximum_intent_score: max_intent_score, total_elapsed_time_ms: time[1] / 1000000 });
        return cb(null, result);
    });
};
