'use strict';

const _ = require('lodash');
const GetDomainData = require('./getDomainData.domain.tool');
const GetEntitiesCombinations = require('./getEntitiesCombinations.domain.tool');

const buildTrainingData = (server, domainId, callback) => {

    GetDomainData(server, domainId, (err, results) => {

        if (err){
            return callback(err, null);
        }

        let entitiesCombinations = [];
        if (results.entities.length > 0){
            entitiesCombinations = GetEntitiesCombinations(results.entities, results.intents);
        }

        const common_examples = _.uniq(_.flatten(_.map(results.intents, (intent) => {

            const buildIntentsPerExamples = _.map(intent.examples, (intentExample) => {

                const entitiesList = _.compact(_.map(intentExample.entities, (entity) => {

                    return entity.extractor ? null : entity;
                }));

                if (entitiesList && entitiesList.length > 0){
                    const entitiesOfIntent = _.map(entitiesList, 'entity');
                    const keyOfEntities = entitiesOfIntent.join('-');
                    let combinationsForThisIntent = entitiesCombinations[keyOfEntities];

                    //If there is just one entity in the text of this intent, flat the array of combinations
                    combinationsForThisIntent = combinationsForThisIntent.length === 1 ? _.flatten(combinationsForThisIntent) : combinationsForThisIntent;

                    const buildedIntents = _.map(combinationsForThisIntent, (combination) => {

                        let intentText = intentExample.userSays;
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
                            intent: intent.intentName,
                            entities: newEntitiesList
                        };

                        return buildedIntent;
                    });

                    return buildedIntents;
                }

                const buildedIntent = {
                    text: intentExample.userSays,
                    intent: intent.intentName,
                    entities: []
                };
                return buildedIntent;
            });

            return _.flatten(buildIntentsPerExamples);
        })));
        var regexs = []
        results.entities.forEach((ent)=>{
                if (ent.regex)
                    regexs.push({name:ent.entityName,pattern:ent.regex}); 
        });
        const data = {
            numberOfIntents: results.intents.length,
            trainingSet: {
                rasa_nlu_data: {
                    common_examples,
                    regex_features : regexs
                }
                
            }
        };

        return callback(null, data);
    });
};

module.exports = buildTrainingData;
