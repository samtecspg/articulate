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

    Wreck.post(rasa + '/parse', { payload: requestPayload, json: true }, (err, wreckResponse, result) => {

        if (err) {
            const error = Boom.badImplementation(`Error calling rasa to parse text on domain ${trainedDomain.name}`);
            return callback(error, null);
        }

        delete result.text;
        const temporalParse = {
            domain: trainedDomain.name
        };
        if (trainedDomain.justER) {
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

        if (err) {
            const error = Boom.badImplementation('Error calling duckling to parse text');
            return callback(error, null);
        }

        //The value in the result is not formatted as JSON. This formats that value
        payload = _.map(payload, (ducklingResult) => {

            //ducklingResult.value = JSON.parse(ducklingResult.value);
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

const castSysEntities = (parseResult, spacyPretrainedEntities, ducklingDimension) => {

    let ducklingEntities = _.map(parseResult.duckling, (entity) => {

        if (ducklingDimension.indexOf(entity.dim) !== -1){
            const tmpEntity = {
                end: entity.end,
                entity: 'sys.duckling_' + entity.dim,
                extractor: 'duckling',
                start: entity.start,
                value: JSON.parse(JSON.stringify(entity.value, replacer))
            };
            return tmpEntity;
        }
        return null;
    });
    ducklingEntities = _.compact(ducklingEntities);

    const regexEntities = _.map(parseResult.regex, (entity) => {

        let tmpEntity = {};
        if (entity.regexType === 'sysRegex') {
            tmpEntity = {
                end: entity.end,
                entity: 'sys.regex_' + entity.name,
                extractor: 'regex',
                start: entity.start,
                value: { value: entity.resolvedRegex }
            };
        }
        else if (entity.regexType === 'entityRegex') {
            tmpEntity = {
                end: entity.end,
                entity: entity.name,
                extractor: 'regex',
                start: entity.start,
                value: { value: entity.entityValue, original: entity.resolvedRegex }
            };
        }
        return tmpEntity;
    });

    parseResult.rasa = _.map(parseResult.rasa, (rasaResult) => {

        let rasaEntities = _.map(rasaResult.entities, (entity) => {

            if (entity.extractor === 'ner_spacy') {
                if (spacyPretrainedEntities.indexOf(entity.entity) !== -1){
                    entity.entity = 'sys.spacy_' + entity.entity.toLowerCase();
                }
                else {
                    return null;
                }
            }
            entity.value = { value: entity.value };
            return entity;
        });

        rasaEntities = _.compact(rasaEntities);
        rasaResult.entities = _.union(rasaEntities, ducklingEntities, regexEntities);

        return rasaResult;
    });

    delete parseResult.duckling;

    return parseResult.rasa;
};

const parseText = (rasa, spacyPretrainedEntities, ERPipeline, ducklingService, ducklingDimension, textToParse, agentData, server, cb) => {

    Async.parallel({
        rasa: (callback) => {

            Async.waterfall([
                (callbackGetDomainRecognizer) => {

                    let domainRecognizerName = _.filter(agentData.trainedDomains, (trainedDomain) => {

                        return trainedDomain.name.indexOf('_domain_recognizer') > -1;
                    });
                    domainRecognizerName = domainRecognizerName.length > 0 ? domainRecognizerName[0] : null;
                    if (domainRecognizerName) {
                        getRasaParse(textToParse, domainRecognizerName, agentData.agent.agentName, rasa, ERPipeline, (err, result) => {

                            if (err) {
                                return callbackGetDomainRecognizer(err, null);
                            }
                            return callbackGetDomainRecognizer(null, result);
                        });
                    }
                    else {
                        return callbackGetDomainRecognizer(null, null);
                    }
                },
                (domainRecognitionResults, callbackGetParseForEachDomain) => {

                    const parsingResults = [];
                    Async.map(agentData.trainedDomains, (trainedDomain, callbk) => {

                        if (!domainRecognitionResults || trainedDomain.name !== domainRecognitionResults.domain) {
                            const start = process.hrtime();
                            getRasaParse(textToParse, trainedDomain, agentData.agent.agentName, rasa, ERPipeline, (err, result) => {

                                if (err) {
                                    return callbk(err, null);
                                }
                                const time = process.hrtime(start);
                                result = Object.assign(result, { elapsed_time_ms: time[1] / 1000000 });
                                if (domainRecognitionResults) {
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

                        if (err) {
                            return callbackGetParseForEachDomain(err, null);
                        }

                        return callbackGetParseForEachDomain(null, parsingResults);
                    });
                }
            ], (err, results) => {

                if (err) {
                    return callback(err, null);
                }

                return callback(null, results);
            });
        },
        duckling: (callback) => {

            const start = process.hrtime();
            getDucklingParse(textToParse, agentData.agent.timezone, agentData.agent.language, ducklingService, (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                const time = process.hrtime(start);
                result = _.map(result, (ducklingParse) => {

                    return Object.assign(ducklingParse, { elapsed_time_ms: time[1] / 1000000 / result.length });
                });
                return callback(null, result);
            });
        },
        regex: (callback) => {

            Async.waterfall([

                (callbackGetAgent) => {

                    server.inject(`/agent/${agentData.agent.id}/export?withReferences=true`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 400) {
                                const errorNotFound = Boom.notFound(res.result.message);
                                return callbackGetAgent(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                            return callbackGetAgent(error, null);
                        }
                        return callbackGetAgent(null, res.result);
                    });
                },
                (agent, callbackGetRegex) => {

                    const regexs = [];
                    agent.entities.forEach((ent) => {

                        if (ent.regex && ent.regex !== '' && ent.type !== 'regex') {
                            regexs.push({ name: ent.entityName, pattern: ent.regex, entityType: ent.type });
                        }
                        if (ent.type === 'regex') {

                            regexs.push({ name: ent.entityName, examples: ent.examples, entityType: ent.type });

                        }

                    });
                    const results = [];
                    regexs.forEach((regex) => {

                        if (regex.pattern) {
                            const regexToTest = new RegExp(regex.pattern, 'i');
                            if (regexToTest.test(textToParse)) {
                                const resultParsed = regexToTest.exec(textToParse);
                                const startIndex = textToParse.indexOf(resultParsed[0]);
                                const endIndex = startIndex + resultParsed[0].length;
                                const resultToSend = Object.assign(regex, { resolvedRegex: resultParsed[0], start: startIndex, end: endIndex, regexType: 'sysRegex' });
                                results.push(_.cloneDeep(resultToSend));
                            }
                        }
                        if (regex.entityType === 'regex') {
                            regex.examples.forEach((regexExample) => {

                                const entityValue = regexExample.value;
                                if (regexExample.synonyms.indexOf(entityValue) < 0) {
                                    regexExample.synonyms.push(entityValue);
                                }
                                const foundRegex = [];
                                regexExample.synonyms.forEach((syn) => {

                                    let regexToTest = null; // re intialize the regex as it has been defined globally
                                    let match;
                                    regexToTest = new RegExp(syn, 'ig');

                                    if (match = regexToTest.exec(textToParse)) {

                                        while (match) {
                                            if (foundRegex.indexOf(match) < 0) {
                                                const startIndex = textToParse.indexOf(match[0]);
                                                const endIndex = startIndex + match[0].length;
                                                const resultToSend = Object.assign(regex, { resolvedRegex: match[0], entityValue, start: startIndex, end: endIndex, regexType: 'entityRegex' });
                                                results.push(_.cloneDeep(resultToSend));
                                                foundRegex.push(match[0]);
                                                match = regexToTest.exec(textToParse);

                                            }
                                        }
                                    }

                                });
                            });
                        }


                    });
                    return callback(null, results);
                }
            ]);
        }
    }, (err, result) => {

        if (err) {
            return cb(err, null);
        }
        const parsedDate = new Date();

        result = castSysEntities(result, spacyPretrainedEntities, ducklingDimension);

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

module.exports = (rasa, spacyPretrainedEntities, ERPipeline, duckling, ducklingDimension, textToParse, agentData, server, cb) => {

    const start = process.hrtime();
    parseText(rasa, spacyPretrainedEntities, ERPipeline, duckling, ducklingDimension, textToParse, agentData, server, (err, result) => {

        if (err) {
            return cb(err, null);
        }
        const time = process.hrtime(start);
        const maximum_intent_score = _.max(_.compact(_.map(_.map(result.result.results, 'intent'), 'confidence')));
        const maximum_domain_score = _.max(_.compact(_.map(result.result.results, 'domainScore')));
        result.result.results = _.orderBy(result.result.results, 'domainScore', 'desc');
        if (maximum_domain_score) {
            result.result = Object.assign(result.result, { maximum_domain_score, maximum_intent_score, total_elapsed_time_ms: time[1] / 1000000 });
        }
        else {
            result.result = Object.assign(result.result, { maximum_intent_score, total_elapsed_time_ms: time[1] / 1000000 });
        }
        return cb(null, result);
    });
};
