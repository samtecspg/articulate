'use strict';

const _ = require('lodash');
const GetData = require('./getData.intent.tool');
const GetEntitiesCombinations = require('./getEntitiesCombinations.intent.tool');

const getIntentExamples = (commonExamples) => {

    let intent_examples = _.cloneDeep(commonExamples);
    intent_examples = _.map(intent_examples, (intentExample) => {

        delete intentExample.entities;
        return intentExample;
    });

    intent_examples = _.uniq(intent_examples);

    return intent_examples;
};

const getEntityExamples = (commonExamples) => {

    let entity_examples = _.cloneDeep(commonExamples);
    entity_examples = _.map(entity_examples, (entityExample) => {

        delete entityExample.intent;
        if (!entityExample.entities || entityExample.entities.length === 0){
            return null;
        }
        return entityExample;
    });

    entity_examples = _.compact(_.uniq(entity_examples));
    return entity_examples;
};

const buildTrainingData = (elasticsearch, modifiedIntent, action, domainRecognitionTraining, callback) => {

    GetData(elasticsearch, modifiedIntent, action, domainRecognitionTraining, (err, results) => {

        if (err){
            return callback(err, null);
        }

        if (domainRecognitionTraining){
            const intents = results.intents;
            const sources = _.map(intents, '_source');
            const numOfDomains = _.uniq(_.map(sources, 'domain')).length;
            if (numOfDomains === 1){
                return callback(null, null);
            }
        }
        else {
            if (results.intents.length === 1){
                return callback(null, null);
            }
        }

        let entitiesCombinations = [];
        if (results.entities.length > 0){
            entitiesCombinations = GetEntitiesCombinations(results.entities, results.intents);
        }

        //Build all train examples based on intents
        const commonExamples = _.map(results.intents, (intent) => {

            const buildIntentsPerExamples = _.map(intent._source.examples, (intentExample) => {

                const entitiesList = intentExample.entities;
                if (entitiesList && entitiesList.length > 0){
                    const sortedEntitiesList = _.sortBy(entitiesList, 'start');
                    const entitiesOfIntent = _.map(sortedEntitiesList, 'entity');
                    const keyOfEntities = entitiesOfIntent.join('-');
                    let combinationsForThisIntent = entitiesCombinations[keyOfEntities];

                    //If there is just one entity in the text of this intent, flat the array of combinations
                    combinationsForThisIntent = combinationsForThisIntent.length === 1 ? _.flatten(combinationsForThisIntent) : combinationsForThisIntent;

                    const buildedIntents = _.map(combinationsForThisIntent, (combination) => {

                        let intentText = intentExample.userSays;
                        const lowestStart = sortedEntitiesList[0].start;
                        const newEntitiesList = [];
                        let shift = 0;
                        const combinationValues = Array.isArray(combination) ? combination : [combination];

                        sortedEntitiesList.forEach( (entity, i) => {

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
                            intent: domainRecognitionTraining ? intent._source.domain : intent._id,
                            entities: newEntitiesList
                        };

                        return buildedIntent;
                    });

                    return buildedIntents;
                }

                const buildedIntent = {
                    text: intentExample.userSays,
                    intent: domainRecognitionTraining ? intent._source.domain : intent._id,
                    entities: []
                };
                return buildedIntent;
            });

            return _.flatten(buildIntentsPerExamples);
        });

        const data = {
            rasa_nlu_data: {
                intent_examples: getIntentExamples(_.flatten(commonExamples)),
                entity_examples: getEntityExamples(_.flatten(commonExamples))
            }
        };

        if (domainRecognitionTraining){
            delete data.rasa_nlu_data.entity_examples;
        }

        return callback(null, data);
    });
};

module.exports = buildTrainingData;
