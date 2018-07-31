'use strict';

const _ = require('lodash');
const GetDomainData = require('./getDomainData.domain.tool');
const GetKeywordsCombinations = require('./getKeywordsCombinations.domain.tool');

const buildTrainingData = (server, domainId, extraTrainingData, callback) => {

    GetDomainData(server, domainId, (err, results) => {

        if (err){
            return callback(err, null);
        }

        let keywordsCombinations = [];
        if (results.keywords.length > 0){
            keywordsCombinations = GetKeywordsCombinations(results.keywords, results.sayings);
        }

        const common_examples = _.uniq(_.flatten(_.map(results.sayings, (saying) => {

            const buildSayingsPerExamples = _.map(saying.examples, (sayingExample) => {

                const keywordsList = _.compact(_.map(sayingExample.keywords, (keyword) => {

                    return keyword.extractor ? null : keyword;
                }));

                if (keywordsList && keywordsList.length > 0){
                    if (extraTrainingData){
                        const keywordsOfSaying = _.map(keywordsList, 'keyword');
                        const keyOfKeywords = keywordsOfSaying.join('-');
                        let combinationsForThisSaying = keywordsCombinations[keyOfKeywords];

                        //If there is just one keyword in the text of this saying, flat the array of combinations
                        combinationsForThisSaying = combinationsForThisSaying.length === 1 ? _.flatten(combinationsForThisSaying) : combinationsForThisSaying;

                        const buildedSayings = _.map(combinationsForThisSaying, (combination) => {

                            let sayingText = sayingExample.userSays;
                            const lowestStart = keywordsList[0].start;
                            const newKeywordsList = [];
                            let shift = 0;
                            const combinationValues = Array.isArray(combination) ? combination : [combination];

                            keywordsList.forEach( (keyword, i) => {

                                const textValue = combinationValues[i].keywordText;
                                const keywordValue = combinationValues[i].keywordValue;
                                const newStart = lowestStart === keyword.start ? keyword.start : keyword.start + shift;
                                const newEnd = newStart + textValue.length;
                                const replacementStart = i === 0 ? keyword.start : newStart;
                                const replacementFinish = i === 0 ? keyword.end : keyword.end + shift;
                                sayingText = sayingText.substring(0, replacementStart) + textValue + sayingText.substring(replacementFinish);
                                newKeywordsList.push({
                                    start: newStart,
                                    end: newEnd,
                                    value: keywordValue,
                                    keyword: keyword.keyword
                                });
                                shift = newEnd - keyword.end;
                            });

                            const buildedSaying = {
                                text: sayingText,
                                saying: saying.sayingName,
                                keywords: newKeywordsList
                            };

                            return buildedSaying;
                        });

                        return buildedSayings;
                    }

                    const newKeywordsList = [];

                    keywordsList.forEach((tempKeyword) => {

                        newKeywordsList.push({
                            start: tempKeyword.start,
                            end: tempKeyword.end,
                            value: tempKeyword.value,
                            keyword: tempKeyword.keyword
                        });
                    });

                    const buildedSaying = {
                        text: sayingExample.userSays,
                        saying: saying.sayingName,
                        keywords: newKeywordsList
                    };

                    return buildedSaying;
                }

                const buildedSaying = {
                    text: sayingExample.userSays,
                    saying: saying.sayingName,
                    keywords: []
                };
                return buildedSaying;
            });

            return _.flatten(buildSayingsPerExamples);
        })));

        let keyword_synonyms = _.flatten(_.map(results.keywords, (keyword) => {

            const keywordSynonyms = _.map(keyword.examples, (example) => {

                const result = {};

                result.value = example.value;
                result.synonyms = _.filter(example.synonyms, (synonym) => {

                    return synonym !== example.value;
                });
                return result;
            });
            return _.flatten(keywordSynonyms);
        }));

        //Add only those keywords that have synonyms
        keyword_synonyms = _.filter(keyword_synonyms, (keywordSynonym) => {

            return keywordSynonym.synonyms.length > 0;
        });

        const regexs = [];
        results.keywords.forEach((ent) => {

            if (ent.regex && ent.regex !== ''){
                regexs.push({ name:ent.keywordName,pattern:ent.regex });
            }
        });

        const data = {
            numberOfSayings: results.sayings.length,
            trainingSet: {
                rasa_nlu_data: {
                    common_examples,
                    regex_features : regexs,
                    keyword_synonyms
                }
            }
        };

        return callback(null, data);
    });
};

module.exports = buildTrainingData;
