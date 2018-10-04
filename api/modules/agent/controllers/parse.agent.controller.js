'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const AgentTools = require('../tools');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const getConfidence = (confidence) => {

    if (confidence){
        try {
            return parseFloat(confidence.replace('@', ''));
        } catch (error) {
            return {
                error: true,
                message: `An error ocurred parsing the confidence with the value: ${confidence}. Error: ${error}`
            };
        }
    }
    else {
        return 1.0;
    }
};

const getEntities = (structuredEntities) => {

    if (structuredEntities){
        try {
            const parsedEntities = JSON.parse(structuredEntities);
            const entities = [];
            Object.keys(parsedEntities).forEach((entity) => {

                const newEntity = {
                    extractor: 'structured_text',
                    confidence: 1,
                    entity,
                    value: {
                        value: parsedEntities[entity]
                    }
                };
                entities.push(newEntity);
            });
            return entities;
        } catch (error) {
            return {
                error: true,
                message: `An error ocurred parsing the entities in the structured text. Error: ${error}` 
            };
        }
    }
    else{
        return [];
    }
};

const generateRasaFormat = (text, intent, confidence, structuredEntities, agentData) => {

    const start = process.hrtime();
    const agentIntents = agentData.intents.intents;
    const intentExists = _.filter(agentIntents, (tempIntent) => {

        return tempIntent.intentName === intent;
    })[0];
    if (intentExists){
        const domains = _.uniq(_.map(agentIntents, 'domain'));
        const domainOfIntent = intentExists.domain;
        const confidenceResult = getConfidence(confidence);
        if (confidenceResult.error){
            return confidenceResult;
        }
        const entities = getEntities(structuredEntities);
        if (entities.error){
            return entities;
        }
        let results = _.map(domains, (domain) => {

            let intentRanking = _.map(agentIntents, (tempIntent) => {

                if (tempIntent.domain === domain){
                    return {
                        confidence: tempIntent.intentName === intent ? confidenceResult : 0,
                        name: tempIntent.intentName
                    }
                }
                return null;
            });
            intentRanking = _.compact(intentRanking);
            intentRanking = _.orderBy(intentRanking, 'confidence', 'desc');
            const domainTime = process.hrtime(start);
            const elapsed_time_ms = domainTime[1] / 1000000;
            return {
                domain,
                project: agentData.agent.agentName,
                entities,
                intent: intentRanking[0],
                intentRanking,
                elapsed_time_ms,
                domainScore: domain === domainOfIntent ? 1 : 0
            }
        });
        results = _.orderBy(results, 'domainScore', 'desc');
        const result = {
            result: {
                document: text,
                time_stamp: new Date().toISOString(),
                results,
                maximum_domain_score: 1,
                maximum_intent_score: confidenceResult
            }
        };
        const time = process.hrtime(start);
        result.result.total_elapsed_time_ms = time[1] / 1000000;
        return result;
    }
    else {
        return null;
    }
};

module.exports = (request, reply) => {

    const agentId = request.params.id;

    let text;
    let timezone;
    if (request.payload) {
        text = request.payload.text;
        timezone = request.payload.timezone;
    }
    else {
        text = request.query.text;
        timezone = request.query.timezone;
    }

    const server = request.server;
    const redis = server.app.redis;
    let documentId;

    Async.waterfall([
        (callback) => {

            server.inject('/agent/' + agentId, (res) => {

                if (res.statusCode !== 200) {
                    if (res.statusCode === 404) {
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return callback(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
                    return callback(error, null);
                }
                return callback(null, res.result);
            });
        },
        (agent, callback) => {

            Async.parallel({
                trainedDomains: Async.apply(AgentTools.getAvailableDomains, server, redis, agent),
                duckling: (callbackGetRasa) => {

                    server.inject(`/agent/${agentId}/settings/ducklingURL`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound('The setting ducklingURL wasn\'t found');
                                return callbackGetRasa(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting ducklingURL');
                            return callbackGetRasa(error, null);
                        }
                        return callbackGetRasa(null, res.result);
                    });
                },
                rasa: (callbackGetRasa) => {

                    server.inject(`/agent/${agentId}/settings/rasaURL`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound('The setting rasaURL wasn\'t found');
                                return callbackGetRasa(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting rasaURL');
                            return callbackGetRasa(error, null);
                        }
                        return callbackGetRasa(null, res.result);
                    });
                },
                spacyPretrainedEntities: (callbackGetSpacyPretrainedEntities) => {

                    server.inject(`/agent/${agentId}/settings/spacyPretrainedEntities`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound('The setting spacyPretrainedEntities wasn\'t found');
                                return callbackGetSpacyPretrainedEntities(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting spacyPretrainedEntities');
                            return callbackGetSpacyPretrainedEntities(error, null);
                        }
                        return callbackGetSpacyPretrainedEntities(null, res.result);
                    });
                },
                ducklingDimension: (callbackGetDucklinDimensions) => {

                    server.inject(`/agent/${agentId}/settings/ducklingDimension`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound('The setting ducklingDimension wasn\'t found');
                                return callbackGetDucklinDimensions(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting ducklingDimension');
                            return callbackGetDucklinDimensions(error, null);
                        }
                        return callbackGetDucklinDimensions(null, res.result);
                    });
                },
                ERPipeline: (callbackGetRasa) => {

                    server.inject(`/agent/${agentId}/settings/entityClassifierPipeline`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound('The setting entityClassifierPipeline wasn\'t found');
                                return callbackGetRasa(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting entityClassifierPipeline');
                            return callbackGetRasa(error, null);
                        }
                        return callbackGetRasa(null, res.result);
                    });
                },
                intents: (callbackGetIntent) => {

                    server.inject(`/agent/${agentId}/intent`, (res) => {

                        if (res.statusCode !== 200) {
                            const error = Boom.create(res.statusCode, 'An error occurred getting the intents of the agent');
                            return callbackGetIntent(error, null);
                        }
                        return callbackGetIntent(null, res.result);
                    });
                }
            }, (err, result) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, Object.assign(result, { agent }));
            });
        },
        (agentData, callback) => {

            const structuredTextRegex = /^[/]([^{@]+)(@[0-9.]+)?([{].+)?/;
            const regexParseResult = structuredTextRegex.exec(text);
            if (regexParseResult){
                const intent =  regexParseResult[1];
                const confidence = regexParseResult[2];
                const structuredEntities = regexParseResult[3];
                const rasaFormattedResponse = generateRasaFormat(text, intent, confidence, structuredEntities, agentData);
                if (rasaFormattedResponse.error){
                    const error = Boom.badRequest(rasaFormattedResponse.message);
                    return callback(error);
                }
                return callback(null, rasaFormattedResponse);
            }
            else {
                agentData.agent.timezone = timezone ? timezone : agentData.agent.timezone;
                AgentTools.parseText(agentData.rasa, agentData.spacyPretrainedEntities, agentData.ERPipeline, agentData.duckling, agentData.ducklingDimension, text, agentData, server, (err, result) => {

                    if (err) {
                        return callback(err);
                    }
                    return callback(null, result);
                });
            }
        }
    ], (err, document) => {

        if (err) {
            return reply(err);
        }

        Async.waterfall([
            (cb) => {

                redis.incr('documentId', (err, newDocumentId) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred getting the new document id.');
                        return cb(error);
                    }
                    documentId = newDocumentId;
                    return cb(null);
                });
            },
            (cb) => {

                document = Object.assign({ id: documentId }, document);
                if (document.result && document.result.results){
                    document.result.results.forEach((result) => {

                        if (result.intent){
                            if (result.intent.name === null){
                                result.intent.name = '';
                            }
                        }
                        if (result.entities){
                            result.entities.forEach((entity) => {

                                if (entity.confidence === null){
                                    entity.confidence = '';
                                }
                            });
                        }
                    });
                }
                const flatDocument = RemoveBlankArray(Flat(document));
                redis.hmset(`document:${documentId}`, flatDocument, (err) => {

                    if (err) {
                        const error = Boom.badImplementation('An error occurred adding the document data.');
                        return cb(error);
                    }
                    return cb(null, document);
                });
            }
        ], (err, result) => {

            if (err) {
                return reply(err, null);
            }
            return reply(result);
        });
    });
};
