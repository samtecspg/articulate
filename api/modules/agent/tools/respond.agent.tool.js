'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

let context;

const getCurrentContext = () => {

    if (context.length > 0) {
        return context[context.length - 1];
    }
    return null;
};

const RespondIntent = require('./respondIntent.agent.tool');
const RespondFallback = require('./respondFallback.agent.tool');

const recognizedEntitiesArePartOfTheContext = (currentContext, recognizedEntities) => {

    let results = _.map(recognizedEntities, (recognizedEntity) => {

        return Object.keys(currentContext.slots).indexOf(recognizedEntity.entity) > -1;
    });
    results = _.compact(results);
    return results.length > 0;
};

const getEntitiesFromRasaResults = (rasaResults) => {

    const entities = _.flatMap(rasaResults.results, (domain) => {

        domain.entities = _.map(domain.entities, (entity) => {

            entity.domain = domain.domain;
            return entity;
        });
        return domain.entities;
    });

    return entities;
};

const getBestRasaResult = (rasaResults, agent) => {

    let rasaResult = {};

    const recognizedDomain = rasaResults.results.maximum_domain_score ? _.filter(rasaResults.results, (rasaResult) => {

        return rasaResults.results.maximum_domain_score === rasaResult.domainScore;
    })[0] : rasaResults.results[0];

    if (recognizedDomain.domainScore && recognizedDomain.domainScore > agent.domainClassifierThreshold){
        rasaResult = recognizedDomain;
    }
    else {
        if (rasaResults.results.length === 1){
            rasaResult = recognizedDomain;
        }
        else {
            rasaResult.entities = getEntitiesFromRasaResults(rasaResults);
        }
    }

    return rasaResult;
};

const getScenarioByName = (scenarioName, agentData) => {

    const agentIntents = _.compact(_.flatten(_.map(agentData.domains, 'intents')));
    const agentScenarios = _.compact(_.map(agentIntents, 'scenario'));
    const scenario = _.filter(agentScenarios, (agentScenario) => {

        return agentScenario.scenarioName === scenarioName;
    })[0];
    return scenario;
};

const getDomainOfIntent = (solvedIntent, agentData) => {

    if (solvedIntent){
        const domain = _.filter(agentData.domains, (agentDomain) => {

            return agentDomain.domainName === solvedIntent.domain;
        })[0];
        return domain;
    }
    return null;
};

const getIntentData = (solvedIntent, agentData) => {

    if (solvedIntent){
        if (agentData.domains){
            const agentIntents = _.compact(_.flatten(_.map(agentData.domains, 'intents')));
            const intent = _.filter(agentIntents, (agentIntent) => {

                return agentIntent.intentName === solvedIntent.name;
            })[0];
            return intent;
        }
        return null;
    }
    return null;
};

const getLastContextWithValidSlots = (recognizedEntities) => {

    const recognizedEntitiesNames = _.map(recognizedEntities, 'entity');
    let keepGoing = true;
    let contextIndex = context.length - 1;
    let lastValidContext = null;
    while (keepGoing && contextIndex !== -1){

        const contextSlots = context[contextIndex].slots ? Object.keys(context[contextIndex].slots) : [];
        const intersection = _.intersection(recognizedEntitiesNames, contextSlots);
        if (intersection.length > 0){
            keepGoing = false;
            lastValidContext = _.cloneDeep(context[contextIndex]);
        }
        contextIndex--;
    }
    return lastValidContext;
};

const persistContext = (server, sessionId, cb) => {

    Async.map(context, (elementInContext, callbackInsertInContext) => {

        if (elementInContext.id){
            if (elementInContext.slots){
                const options = {
                    url: `/context/${sessionId}/${elementInContext.id}`,
                    method: 'PUT',
                    payload: {
                        slots: elementInContext.slots
                    }
                };

                server.inject(options, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred updating the context ${elementInContext.id} of the session ${sessionId}`);
                        return callbackInsertInContext(error, null);
                    }
                    return callbackInsertInContext(null);
                });
            }
            else {
                return callbackInsertInContext(null);
            }
        }
        else {

            if (elementInContext.slots && Object.keys(elementInContext.slots).length === 0){
                delete elementInContext.slots;
            }
            const options = {
                url: `/context/${sessionId}`,
                method: 'POST',
                payload: elementInContext
            };

            server.inject(options, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred adding the a new element to the session ${sessionId}`);
                    return callbackInsertInContext(error, null);
                }
                return callbackInsertInContext(null);
            });
        }
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = (server, sessionId, timezone, data, callback) => {

    Async.waterfall([
        (callbackLoadContext) => {

            server.inject(`/context/${sessionId}`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the context of the session ${sessionId}`);
                    return callbackLoadContext(error, null);
                }
                context = res.result;
                return callbackLoadContext(null);
            });
        },
        (callbackGetResponse) => {

            let currentContext = getCurrentContext();
            if (data.parseResult && data.parseResult.result) {
                const userText = data.parseResult.result.document;
                const rasaResult = getBestRasaResult(data.parseResult.result, data.agentData);
                const solvedIntent = rasaResult.intent;
                data.intent = getIntentData(solvedIntent, data.agentData);
                data.scenario = data.intent ? data.intent.scenario : null;
                if (solvedIntent && !data.scenario){
                    RespondFallback(data, currentContext, timezone, (err, response) => {

                        if (err){
                            return callbackGetResponse(err, null);
                        }
                        return callbackGetResponse(null, response);
                    });
                }
                else {
                    data.domain = getDomainOfIntent(data.intent, data.agentData);
                    if (solvedIntent && data.scenario && data.intent && data.domain && solvedIntent.confidence > data.domain.intentThreshold) {
                        if (!currentContext || (solvedIntent.name !== currentContext.name)) {
                            context.push({
                                name: solvedIntent.name,
                                scenario: data.scenario.scenarioName,
                                slots: {}
                            });
                            currentContext = getCurrentContext();
                        }
                        RespondIntent(userText, context, currentContext, solvedIntent, data.scenario, rasaResult, timezone, data.agentData.webhookUrl, (err, response) => {

                            if (err){
                                return callbackGetResponse(err, null);
                            }
                            return callbackGetResponse(null, response);
                        });
                    }
                    else {
                        const recognizedEntities = !solvedIntent ? rasaResult.entities : getEntitiesFromRasaResults(data.parseResult.result);
                        if (currentContext) {
                            if (recognizedEntities.length > 0 ){
                                if (currentContext.slots && Object.keys(currentContext.slots).length > 0 && recognizedEntitiesArePartOfTheContext(currentContext, recognizedEntities)){
                                    //Current context contains the intent and the slots that's why it is passed twice
                                    data.scenario = getScenarioByName(currentContext.scenario, data.agentData);
                                    RespondIntent(userText, context, currentContext, currentContext, data.scenario, rasaResult, timezone, data.agentData.webhookUrl,  (err, response) => {

                                        if (err){
                                            return callbackGetResponse(err, null);
                                        }
                                        return callbackGetResponse(null, response);
                                    });
                                }
                                else {
                                    const lastValidContext = getLastContextWithValidSlots(recognizedEntities);
                                    if (lastValidContext) {
                                        context.push(lastValidContext);
                                        currentContext = lastValidContext;
                                        //Current context contains the intent and the slots that's why it is passed twice
                                        data.scenario = getScenarioByName(currentContext.scenario, data.agentData);
                                        RespondIntent(userText, context, currentContext, currentContext, data.scenario, rasaResult, timezone, data.agentData.webhookUrl, (err, response) => {

                                            if (err){
                                                return callbackGetResponse(err, null);
                                            }
                                            return callbackGetResponse(null, response);
                                        });
                                    }
                                    else {
                                        RespondFallback(data, currentContext, timezone, (err, response) => {

                                            if (err){
                                                return callbackGetResponse(err, null);
                                            }
                                            return callbackGetResponse(null, response);
                                        });
                                    }
                                }
                            }
                            else {
                                RespondFallback(data, currentContext, timezone, (err, response) => {

                                    if (err){
                                        return callbackGetResponse(err, null);
                                    }
                                    return callbackGetResponse(null, response);
                                });
                            }
                        }
                        else {
                            RespondFallback(data, currentContext, timezone, (err, response) => {

                                if (err){
                                    return callbackGetResponse(err, null);
                                }
                                return callbackGetResponse(null, response);
                            });
                        }
                    }
                }
            }
            else {
                const message = 'Sorry but the NLU engine didn\'t were able to parse your text';
                const error = Boom.badImplementation(message);
                return callbackGetResponse(error, null);
            }
        }
    ], (err, response) => {

        if (err){
            return callback(err);
        }
        persistContext(server, sessionId, (err) => {

            if (err){
                return callback(err);
            }
            return callback(response);
        });
    });
};
