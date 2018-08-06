'use strict';

const _ = require('lodash');
const GetAgentData = require('./getAgentData.domain.tool');
const GetKeywordsCombinations = require('./getKeywordsCombinations.domain.tool');

const buildDomainRecognitionTrainingData = (server, agentId, extraTrainingData, cb) => {

    GetAgentData(server, agentId, (err, data) => {

        if (err){
            return cb(err, null);
        }

        let countOfDomainsWithSayings = 0;
        data.forEach((domain) => {

            countOfDomainsWithSayings += (domain.sayings.length > 0 ? 1 : 0);
        });
        if (countOfDomainsWithSayings < 2){
            return cb(null, null);
        }

        const domainsExamples = data.map( (domain) => {

            let keywordsCombinations = [];
            if (domain.keywords.length > 0){
                keywordsCombinations = GetKeywordsCombinations(domain.keywords, domain.sayings);
            }

            const common_examples = _.uniq(_.flatten(_.map(domain.sayings, (saying) => {

                const keywordsList = _.compact(_.map(saying.keywords, (keyword) => {

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

                            let sayingText = saying.userSays;
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
                                    entity: keyword.keyword
                                });
                                shift = newEnd - keyword.end;
                            });

                            const buildedSaying = {
                                text: sayingText,
                                saying: domain.domainName,
                                entities: newKeywordsList
                            };

                            return buildedSaying;
                        });

                        return buildedSayings;
                    }

                    const newKeywordsList = [];

                    saying.keywords.forEach((tempKeyword) => {

                        newKeywordsList.push({
                            start: tempKeyword.start,
                            end: tempKeyword.end,
                            value: tempKeyword.value,
                            entity: tempKeyword.keyword
                        });
                    });

                    const buildedSaying = {
                        text: saying.userSays,
                        saying: domain.domainName,
                        entities: newKeywordsList
                    };

                    return buildedSaying;
                }

                const buildedSaying = {
                    text: saying.userSays,
                    saying: domain.domainName,
                    entities: []
                };
                return buildedSaying;
            })));

            return common_examples;
        });

        const keyword_synonyms = _.flatten(data.map( (domain) => {

            let domain_keyword_synonyms = _.flatten(_.map(domain.keywords, (keyword) => {

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
            domain_keyword_synonyms = _.filter(domain_keyword_synonyms, (keywordSynonym) => {

                return keywordSynonym.synonyms.length > 0;
            });

            return domain_keyword_synonyms;
        }));

        const regexs = [];
        data.forEach((domain) => {

            domain.keywords.forEach((ent) => {

                if (ent.regex && ent.regex !== ''){
                    regexs.push({ name:ent.keywordName,pattern:ent.regex });
                }
            });
        });

        const trainingData = {
            rasa_nlu_data: {
                common_examples: _.flatten(domainsExamples),
                regex_features : regexs,
                keyword_synonyms
            }
        };

        return cb(null, trainingData);
    });
};

module.exports = buildDomainRecognitionTrainingData;
