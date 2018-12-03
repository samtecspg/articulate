import _ from 'lodash';
import {
    RASA_COMMON_EXAMPLES,
    RASA_ENTITY_SYNONYMS,
    RASA_KEYWORD_SYNONYMS,
    RASA_NLU_DATA,
    RASA_REGEX_FEATURES
} from '../../../util/constants';
import RedisErrorHandler from '../../errors/redis.error-handler';

module.exports = async function ({ keywords, sayings, extraTrainingData, isKeyword = true, categoryName = null }) {

    const {
        keywordService
    } = await this.server.services();

    try {

        let keywordsCombinations = [];
        if (extraTrainingData && keywords.length > 0) {
            keywordsCombinations = await keywordService.combinationsFromSayings({ keywords, sayings });
        }
        const uniqueActionsCount = _.uniq(_.flattenDeep(_.map(sayings, 'actions'))).length;
        const commonExamples = _.uniq(_.flatten(_.map(sayings, (saying) => {

            const keywordsList = _.compact(_.map(saying.keywords, (keyword) => {

                return keyword.extractor ? null : keyword;
            }));

            if (keywordsList && keywordsList.length > 0) {
                if (extraTrainingData) {
                    const keywordsOfSaying = _.map(keywordsList, 'keyword');
                    const keyOfKeywords = keywordsOfSaying.join('-');
                    let combinationsForThisSaying = keywordsCombinations[keyOfKeywords];
                    combinationsForThisSaying = combinationsForThisSaying.length === 1 ? _.flatten(combinationsForThisSaying) : combinationsForThisSaying;

                    return _.map(combinationsForThisSaying, (combination) => {

                        let sayingText = saying.userSays;
                        const lowestStart = keywordsList[0].start;
                        const newKeywordsList = [];
                        let shift = 0;
                        const combinationValues = Array.isArray(combination) ? combination : [combination];

                        keywordsList.forEach((keyword, i) => {

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

                        return {
                            text: sayingText,
                            intent: categoryName || saying.actions.join('+'),
                            entities: newKeywordsList
                        };
                    });
                }

                const newKeywordsList = [];

                keywordsList.forEach((tempKeyword) => {

                    newKeywordsList.push({
                        start: tempKeyword.start,
                        end: tempKeyword.end,
                        value: tempKeyword.value,
                        entity: tempKeyword.keyword
                    });
                });

                return {
                    text: saying.userSays,
                    intent: categoryName || saying.actions.join('+'),
                    entities: newKeywordsList
                };
            }

            return {
                text: saying.userSays,
                intent: categoryName || saying.actions.join('+'),
                entities: []
            };
        })));

        let keywordSynonyms = _.flatten(_.map(keywords, (keyword) => {

            const synonyms = _.map(keyword.examples, (example) => {

                const result = {};

                result.value = example.value;
                result.synonyms = _.filter(example.synonyms, (synonym) => {

                    return synonym !== example.value;
                });
                return result;
            });
            return _.flatten(synonyms);
        }));

        keywordSynonyms = _.filter(keywordSynonyms, (keywordSynonym) => {

            return keywordSynonym.synonyms.length > 0;
        });

        const regexs = [];
        keywords.forEach((ent) => {

            if (ent.regex && ent.regex !== '') {
                regexs.push({ name: ent.keywordName, pattern: ent.regex });
            }
        });

        return {
            numberOfSayings: uniqueActionsCount,
            [RASA_NLU_DATA]: {
                [RASA_COMMON_EXAMPLES]: commonExamples,
                [RASA_REGEX_FEATURES]: regexs,
                [`${isKeyword ? RASA_KEYWORD_SYNONYMS : RASA_ENTITY_SYNONYMS}`]: keywordSynonyms
            }
        };
    }
    catch (error) {
        throw RedisErrorHandler({ error });
    }
};
