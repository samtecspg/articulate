import _ from 'lodash';

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

module.exports = async function ({ keywords, sayings }) {

    const {  globalService  } = await this.server.services();

    const usedKeywords = _.compact(_.uniq(_.map(sayings, (saying) => {

        if (saying.keywords) {
            return _.compact(_.map(saying.keywords, (keyword) => {

                return keyword.extractor ? null : keyword.keyword;
            }));
        }
        return null;
    })));

    const combinations = {};
    _.map(usedKeywords, (tupleOfKeywords) => {

        const key = tupleOfKeywords.join('-');

        if (!combinations[key]) {

            const keywordsList = _.map(tupleOfKeywords, (keyword) => {

                const matchedKeyword = _.filter(keywords, (fullKeyword) => {

                    return fullKeyword.keywordName === keyword;
                })[0];
                return _.flatten(_.map(matchedKeyword.examples, (entry) => {

                    if (entry.synonyms && entry.synonyms.length > 0) {
                        return _.map(entry.synonyms, (synonym) => {

                            return { keywordValue: entry.value, keywordText: synonym };
                        });
                    }
                    return [{ keywordValue: entry.value, keywordText: entry.value }];
                }));
            });

            let keywordsCombinations;
            if (keywordsList.length > 1 && Array.isArray(keywordsList[0])) {
                keywordsCombinations = globalService.cartesianProduct({ list: keywordsList });
                keywordsCombinations = removeDuplicatesAndRepeatedValues(keywordsCombinations);
            }
            else {
                keywordsCombinations = keywordsList;
            }

            combinations[key] = keywordsCombinations;
        }
    });

    return combinations;
};
