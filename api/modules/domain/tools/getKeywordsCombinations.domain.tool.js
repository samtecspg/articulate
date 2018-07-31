'use strict';

const _ = require('lodash');

const CartesianProduct = require('./cartesianProduct.domain.tool');

const homogenize = (combination) => {

    return _.map(_.orderBy(combination, 'keywordText'), 'keywordText').join(',');
};

const removeDuplicatesAndRepeatedValues = (keywordsCombinations) => {

    let cleanKeywordsCombinations = _.uniqBy(keywordsCombinations, homogenize);

    cleanKeywordsCombinations = _.filter(cleanKeywordsCombinations, (combination) => {

        const countOfDifferentTexts = _.countBy(combination, 'keywordText');
        return combination.length === Object.keys(countOfDifferentTexts).length;
    });
    return cleanKeywordsCombinations;
};

const getCombinationOfKeywords = (keywords, sayings) => {

    const sayingExamples = _.flatten(_.map(sayings, 'examples'));
    const usedKeywords = _.compact(_.uniq(_.map(sayingExamples, (example) => {

        if (example.keywords){
            const exampleKeywords = _.compact(_.map(example.keywords, (keyword) => {

                return keyword.extractor ? null : keyword.keyword;
            }));
            return exampleKeywords;
        }
        return null;
    })));

    const combinations = {};
    _.map(usedKeywords, (tupleOfKeywords) => {

        const key = tupleOfKeywords.join('-');

        if (!combinations[key]){

            const keywordsList = _.map(tupleOfKeywords, (keyword) => {

                const matchedKeyword = _.filter(keywords, (fullKeyword) => {

                    return fullKeyword.keywordName === keyword;
                })[0];
                const synonyms = _.flatten(_.map(matchedKeyword.examples, (entry) => {

                    if (entry.synonyms && entry.synonyms.length > 0){
                        return _.map(entry.synonyms, (synonym) => {

                            return { keywordValue: entry.value, keywordText: synonym };
                        });
                    }
                    return [{ keywordValue: entry.value, keywordText: entry.value }];
                }));
                return synonyms;
            });

            let keywordsCombinations;
            if (keywordsList.length > 1 && Array.isArray(keywordsList[0])){
                keywordsCombinations = CartesianProduct(keywordsList);
                keywordsCombinations = removeDuplicatesAndRepeatedValues(keywordsCombinations);
            }
            else {
                keywordsCombinations = keywordsList;
            }

            combinations[key] = keywordsCombinations;
        }
        return;
    });

    return combinations;
};

module.exports = getCombinationOfKeywords;
