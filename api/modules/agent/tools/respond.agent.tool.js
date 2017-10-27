'use strict';

const debug = require('debug')('nlu:model:Converse:respond');
const Boom = require('boom');
const _ = require('lodash');

const CONTEXT = [];

const getCurrentContext = () => {

    if (CONTEXT.length > 0) {
        return CONTEXT[CONTEXT.length - 1];
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

    const recognizedDomain = rasaResults.results.length > 1 ? _.filter(rasaResults.results, (rasaResult) => {

        return rasaResult.domain.indexOf('domain-recognizer') !== -1;
    })[0] : rasaResults.results[0];

    let rasaResult = {};

    if (rasaResults.results.length > 1 && recognizedDomain.intent.confidence > agent.domainClassifierThreshold){
        rasaResult = _.filter(rasaResults.results, (tempResult) => {

            return tempResult.domain === recognizedDomain.intent.name;
        })[0];
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

const getScenarioForIntent = (solvedIntent, agentData) => {

    if (solvedIntent){
        const scenario = _.filter(agentData, (tmpData) => {

            return tmpData._index === 'scenario' && tmpData._source.intent === solvedIntent.name;
        })[0];
        return scenario ? Object.assign({ _id: scenario._id }, scenario._source) : scenario;
    }
    return null;
};

const getScenarioById = (scenarioId, agentData) => {

    const scenario = _.filter(agentData, (tmpData) => {

        return tmpData._id === scenarioId;
    })[0];
    return scenario ? Object.assign({ _id: scenario._id }, scenario._source) : scenario;
};

const getDomainOfIntent = (solvedIntent, agentData) => {

    if (solvedIntent){
        const domain = _.filter(agentData, (tmpData) => {

            return tmpData._index === 'domain' && tmpData._id === solvedIntent.domain;
        })[0];
        return domain._source;
    }
    return null;
};

const getIntentData = (solvedIntent, agentData) => {

    if (solvedIntent){
        const intent = _.filter(agentData, (tmpData) => {

            return tmpData._index === 'intent' && tmpData._id === solvedIntent.name;
        })[0];
        return intent._source;
    }
    return null;
};

const getAgent = (agentData) => {

    const agent = _.filter(agentData, (tmpData) => {

        return tmpData._index === 'agent';
    })[0];
    return agent._source;
};

const getLastContextWithValidSlots = (recognizedEntities) => {

    const recognizedEntitiesNames = _.map(recognizedEntities, 'entity');
    let keepGoing = true;
    let contextIndex = CONTEXT.length - 1;
    let lastValidContext = null;
    while (keepGoing && contextIndex !== -1){

        const contextSlots = Object.keys(CONTEXT[contextIndex].slots);
        const intersection = _.intersection(recognizedEntitiesNames, contextSlots);
        if (intersection.length > 0){
            keepGoing = false;
            lastValidContext = _.cloneDeep(CONTEXT[contextIndex]);
        }
        contextIndex--;
    }
    return lastValidContext;
};

module.exports = (timezone, data, callback) => {


    let currentContext = getCurrentContext();
    if (data.parseResult && data.parseResult.result) {
        data.agent = getAgent(data.agentData);
        const rasaResult = getBestRasaResult(data.parseResult.result, data.agent);
        const solvedIntent = rasaResult.intent;
        data.intent = getIntentData(solvedIntent, data.agentData);
        data.scenario = getScenarioForIntent(solvedIntent, data.agentData);
        data.domain = getDomainOfIntent(data.intent, data.agentData);
        if (solvedIntent && data.scenario && data.intent && data.domain && solvedIntent.confidence > data.domain.intentThreshold) {
            if (!currentContext || (solvedIntent.name !== currentContext.name)) {
                CONTEXT.push({
                    name: solvedIntent.name,
                    scenario: data.scenario._id,
                    slots: {}
                });
                currentContext = getCurrentContext();
            }
            RespondIntent(CONTEXT, currentContext, solvedIntent, data.scenario, rasaResult, timezone, data.agent.webhookUrl, (err, response) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
        else {
            const recognizedEntities = !solvedIntent ? rasaResult.entities : getEntitiesFromRasaResults(data.parseResult.result);
            if (currentContext) {
                if (recognizedEntities.length > 0 ){
                    if (Object.keys(currentContext.slots).length > 0 && recognizedEntitiesArePartOfTheContext(currentContext, recognizedEntities)){
                        //Current context contains the intent and the slots that's why it is passed twice
                        data.scenario = getScenarioById(currentContext.scenario, data.agentData);
                        RespondIntent(CONTEXT, currentContext, currentContext, data.scenario, rasaResult, timezone, data.agent.webhookUrl,  (err, response) => {

                            if (err){
                                return callback(err, null);
                            }
                            return callback(null, response);
                        });
                    }
                    else {
                        const lastValidContext = getLastContextWithValidSlots(recognizedEntities);
                        if (lastValidContext) {
                            CONTEXT.push(lastValidContext);
                            currentContext = lastValidContext;
                            //Current context contains the intent and the slots that's why it is passed twice
                            data.scenario = getScenarioById(currentContext.scenario, data.agentData);
                            RespondIntent(CONTEXT, currentContext, currentContext, data.scenario, rasaResult, timezone, data.agent.webhookUrl, (err, response) => {

                                if (err){
                                    return callback(err, null);
                                }
                                return callback(null, response);
                            });
                        }
                        else {
                            RespondFallback(data, currentContext, timezone, (err, response) => {

                                if (err){
                                    return callback(err, null);
                                }
                                return callback(null, response);
                            });
                        }
                    }
                }
                else {
                    RespondFallback(data, currentContext, timezone, (err, response) => {

                        if (err){
                            return callback(err, null);
                        }
                        return callback(null, response);
                    });
                }
            }
            else {
                RespondFallback(data, currentContext, timezone, (err, response) => {

                    if (err){
                        return callback(err, null);
                    }
                    return callback(null, response);
                });
            }
        }
    }
    else {
        debug('NLU API - respond - no data from rasa: Error');
        const message = 'Sorry but the NLU engine didn\'t were able to parse your text';
        const error = Boom.badImplementation(message);
        return callback(error, null);
    }
};
