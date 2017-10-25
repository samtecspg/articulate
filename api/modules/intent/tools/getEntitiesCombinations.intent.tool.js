'use strict';

const _ = require('lodash');

const CartesianProduct = require('./cartesianProduct.intent.tool');

const getCombinationOfEntities = (entities, intents) => {

    //Get tuples of entities used in entities list on intents. Excludes empty values with compact
    const intentsSource = _.map(intents, '_source');
    const intentsExamples = _.compact(_.flatten(_.map(intentsSource, 'examples')));
    let entitiesLists = _.map(intentsExamples, 'entities');
    entitiesLists = _.compact(entitiesLists);
    const entitiesInIntents = _.map(entitiesLists, (entitiesList) => {

        //The entities are sorted by start to build consistent keys that allow to calculate shift of text
        //when replacing values of entities on the intent of the text
        const sortedEntitiesList = _.sortBy(entitiesList, 'start');
        return _.map(sortedEntitiesList, 'entity');
    });

    const combinations = {};
    _.map(entitiesInIntents, (tupleOfEntities) => {

        const key = tupleOfEntities.join('-');

        if (!combinations[key]){
            //Builds the list of entities based on the synonyms for each entity
            const entitiesList = _.map(tupleOfEntities, (entity) => {

                let matchedEntity = _.filter(entities, (fullEntity) => {

                    return fullEntity._id === entity;
                })[0];
                matchedEntity = matchedEntity._source;
                const synonyms = _.flatten(_.map(matchedEntity.examples, (entry) => {

                    if (entry.synonyms && entry.synonyms.length > 0){
                        return _.map(entry.synonyms, (synonym) => {

                            return { entityValue: entry.value, entityText: synonym };
                        });
                    }
                    return [{ entityValue: entry.value, entityText: entry.value }];
                }));
                return synonyms;
            });

            let entitiesCombinations;
            if (entitiesList.length > 1 && Array.isArray(entitiesList[0])){
                entitiesCombinations = CartesianProduct(entitiesList);
            }
            else {
                entitiesCombinations = entitiesList;
            }

            combinations[key] = entitiesCombinations;
        }
        return;
    });

    return combinations;
};

module.exports = getCombinationOfEntities;
