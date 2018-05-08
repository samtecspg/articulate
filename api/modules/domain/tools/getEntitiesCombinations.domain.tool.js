'use strict';

const _ = require('lodash');

const CartesianProduct = require('./cartesianProduct.domain.tool');

const homogenize = (combination) => {

    return _.map(_.orderBy(combination, 'entityText'), 'entityText').join(',');
};

const removeDuplicatesAndRepeatedValues = (entitiesCombinations) => {

    let cleanEntitiesCombinations = _.uniqBy(entitiesCombinations, homogenize);

    cleanEntitiesCombinations = _.filter(cleanEntitiesCombinations, (combination) => {

        const countOfDifferentTexts = _.countBy(combination, 'entityText');
        return combination.length === Object.keys(countOfDifferentTexts).length;
    });
    return cleanEntitiesCombinations;
};

const getCombinationOfEntities = (entities, intents) => {

    const intentExamples = _.flatten(_.map(intents, 'examples'));
    const usedEntities = _.compact(_.uniq(_.map(intentExamples, (example) => {

        if (example.entities){
            const exampleEntities = _.compact(_.map(example.entities, (entity) => {

                return entity.extractor ? null : entity.entity;
            }));
            return exampleEntities;
        }
        return null;
    })));

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
                entitiesCombinations = removeDuplicatesAndRepeatedValues(entitiesCombinations);
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
