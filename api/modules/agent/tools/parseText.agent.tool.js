'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Wreck = require('wreck');
const Querystring = require('querystring');

const DucklingOutputToIntervals = require('./ducklingOutputToInterval.agent.tool');

const getRasaParse = (textToParse, trainedDomain, agentName, rasa, ERPipeline, callback) => {

    const requestPayload = {
        q: textToParse,
        project: agentName,
        model: trainedDomain.model
    };

    if (trainedDomain.justER){
        requestPayload.pipeline = ERPipeline.join(',');
    }

    Wreck.post(rasa + '/parse', { payload: requestPayload, json: true }, (err, wreckResponse, result) => {

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
        lang: language,
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

const parseText = (redis, rasa, ERPipeline, ducklingService, textToParse, timezone, language, agentData, cb) => {

    Async.parallel({
        rasa: (callback) => {

            Async.waterfall([
                (cb) => {
                    let domainRecognizerName = _.filter(agentData.trainedDomains, (trainedDomain) => {
                        return trainedDomain.name.indexOf('_domain_recognizer') > -1;
                    });
                    domainRecognizerName = domainRecognizerName.length > 0 ? domainRecognizerName[0] : null;
                    if (domainRecognizerName){
                        getRasaParse(textToParse, domainRecognizerName, agentData.agent.agentName, rasa, ERPipeline, (err, result) => {

                            if (err){
                                return cb(err, null);
                            }
                            return cb(null, result);
                        });
                    }
                    else {
                        return cb(null, null);
                    }
                },
                (domainRecognitionResults, cb) => {

                    const parsingResults = [];
                    Async.map(agentData.trainedDomains, (trainedDomain, callbk) => {

                        if (!domainRecognitionResults || trainedDomain.name !== domainRecognitionResults.domain){
                            const start = process.hrtime();
                            getRasaParse(textToParse, trainedDomain, agentData.agent.agentName, rasa, ERPipeline, (err, result) => {

                                if (err){
                                    return callbk(err, null);
                                }
                                const time = process.hrtime(start);
                                result = Object.assign(result, { elapsed_time_ms: time[1] / 1000000 });
                                if (domainRecognitionResults){
                                    let domainScore = _.filter(domainRecognitionResults.intent_ranking, (recognizedDomain) => {
                                        return recognizedDomain.name === result.domain;
                                    });
                                    domainScore = domainScore.length > 0 ? domainScore[0].confidence : 0;
                                    result = Object.assign(result, { domainScore });
                                }
                                parsingResults.push(result);
                                return callbk(null);
                            });
                        }
                        else {
                            return callbk(null);
                        }
                    }, (err) => {

                        if (err){
                            return cb(err, null);
                        }

                        return cb(null, parsingResults);
                    });
                }
            ], (err, results) => {

                if (err){
                    return callback(err, null);
                }

                return callback(null, results);
            });
        },
        duckling: (callback) => {

            const start = process.hrtime();
            getDucklingParse(textToParse, timezone, language, ducklingService, (err, result) => {

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

module.exports = (redis, rasa, ERPipeline, duckling, textToParse, timezone, language, agentData, cb) => {

    const start = process.hrtime();
    parseText(redis, rasa, ERPipeline, duckling, textToParse, timezone, language, agentData, (err, result) => {

        if (err){
            return cb(err, null);
        }
        const time = process.hrtime(start);
        const maximum_intent_score = _.max(_.compact(_.map(_.map(result.result.results, 'intent'), 'confidence')));
        const maximum_domain_score = _.max(_.compact(_.map(result.result.results, 'domainScore')));
        result.result = Object.assign(result.result, { maximum_domain_score, maximum_intent_score, total_elapsed_time_ms: time[1] / 1000000 });
        return cb(null, result);
    });
};
