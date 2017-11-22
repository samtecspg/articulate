'use strict';

const _ = require('lodash');
const GetAgentData = require('./getAgentData.intent.tool');
const GetEntitiesCombinations = require('./getEntitiesCombinations.intent.tool');
const Async = require('async');

const buildDomainRecognitionTrainingData = (server, agentId, cb) => {

    GetAgentData(server, agentId, (err, data) => {

        if (err){
            return cb(err, null);
        }

        let countOfDomainsWithIntents = 0;
        data.forEach(domain => {
            countOfDomainsWithIntents += (domain.intents.length > 0 ? 1: 0);
        });
        if (countOfDomainsWithIntents < 2){
            return cb(null, null);
        }

        const domainsExamples = data.map( (domain) => {
            
            let entitiesCombinations = [];
            if (domain.entities.length > 0){
                entitiesCombinations = GetEntitiesCombinations(domain.entities, domain.intents);
            }
            
            const common_examples = _.uniq(_.flatten(_.map(domain.intents, (intent) => {
    
                const buildIntentsPerExamples = _.map(intent.examples, (intentExample) => {
    
                    const entitiesList = [];
    
                    const entityPattern = /\{(.+?)\}/g;
                    let match;
                    while((match = entityPattern.exec(intentExample)) != null){
                        entitiesList.push({
                            start: match.index,
                            end: match.index + match[0].length,
                            value: match[0],
                            entity: match[1]
                        });
                    }
    
                    if (entitiesList.length > 0){
                        const entitiesOfIntent = _.map(entitiesList, 'entity');
                        const keyOfEntities = entitiesOfIntent.join('-');
                        let combinationsForThisIntent = entitiesCombinations[keyOfEntities];
    
                        //If there is just one entity in the text of this intent, flat the array of combinations
                        combinationsForThisIntent = combinationsForThisIntent.length === 1 ? _.flatten(combinationsForThisIntent) : combinationsForThisIntent;
    
                        const buildedIntents = _.map(combinationsForThisIntent, (combination) => {
    
                            let intentText = intentExample;
                            const lowestStart = entitiesList[0].start;
                            const newEntitiesList = [];
                            let shift = 0;
                            const combinationValues = Array.isArray(combination) ? combination : [combination];
    
                            entitiesList.forEach( (entity, i) => {
    
                                const textValue = combinationValues[i].entityText;
                                const entityValue = combinationValues[i].entityValue;
                                const newStart = lowestStart === entity.start ? entity.start : entity.start + shift;
                                const newEnd = newStart + textValue.length;
                                const replacementStart = i === 0 ? entity.start : newStart;
                                const replacementFinish = i === 0 ? entity.end : entity.end + shift;
                                intentText = intentText.substring(0, replacementStart) + textValue + intentText.substring(replacementFinish);
                                newEntitiesList.push({
                                    start: newStart,
                                    end: newEnd,
                                    value: entityValue,
                                    entity: entity.entity
                                });
                                shift = newEnd - entity.end;
                            });
    
                            const buildedIntent = {
                                text: intentText,
                                intent: domain.domainName,
                                entities: newEntitiesList
                            };
    
                            return buildedIntent;
                        });
    
                        return buildedIntents;
                    }
    
                    const buildedIntent = {
                        text: intentExample,
                        intent: domain.domainName,
                        entities: []
                    };
                    return buildedIntent;
                });
    
                return _.flatten(buildIntentsPerExamples);
            })));

            return common_examples;
        });

        const trainingData = {
            rasa_nlu_data: {
                common_examples: _.flatten(domainsExamples)
            }
        };

        return cb(null, trainingData);
    });
};

module.exports = buildDomainRecognitionTrainingData;
