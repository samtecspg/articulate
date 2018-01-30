'use strict';

const _ = require('lodash');

const CartesianProduct = require('./cartesianProduct.domain.tool');

const getCombinationOfEntities = (entities, intents) => {

    const intentExamples = _.flatten(_.map(intents, 'examples'));
    const usedEntities = _.uniq(_.map(intentExamples, (example) => {

        const exampleEntities = _.map(example.entities, 'entity');
        return exampleEntities;
    }));
    /*const notNullEntities = _.compact(intentsEntities);
    const entitiesArrays = _.compact(intentsEntities);
    const usedEntities = _.map(_.flatten(_.map(notNullEntities, 'entity')));*/

    const combinations = {};
    _.map(usedEntities, (tupleOfEntities) => {

        const key = tupleOfEntities.join('-');

        if (!combinations[key]){

            const entitiesList = _.map(tupleOfEntities, (entity) => {

                const matchedEntity = _.filter(entities, (fullEntity) => {

                    return fullEntity.entityName === entity;
                })[0];
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
