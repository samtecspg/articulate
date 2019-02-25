"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.invalid-actions-sayings-count"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCommonExamples = (sayings, extraTrainingData, keywordsCombinations, categoryName, sayingsPerActions) => {
  return _lodash.default.uniq(_lodash.default.flatten(_lodash.default.map(sayings, saying => {
    const keywordsList = _lodash.default.compact(_lodash.default.map(saying.keywords, keyword => {
      return keyword.extractor ? null : keyword;
    }));

    if (keywordsList && keywordsList.length > 0) {
      if (extraTrainingData) {
        const keywordsOfSaying = _lodash.default.map(keywordsList, 'keyword');

        const keyOfKeywords = keywordsOfSaying.join('-');
        let combinationsForThisSaying = keywordsCombinations[keyOfKeywords];
        combinationsForThisSaying = combinationsForThisSaying.length === 1 ? _lodash.default.flatten(combinationsForThisSaying) : combinationsForThisSaying;
        return _lodash.default.map(combinationsForThisSaying, combination => {
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

          if (!categoryName) {
            saying.actions.forEach(actionName => {
              sayingsPerActions[actionName] = sayingsPerActions[actionName] === undefined ? 1 : sayingsPerActions[actionName] + 1;
            });
          }

          return {
            text: sayingText,
            intent: categoryName || saying.actions.join(_constants.RASA_INTENT_SPLIT_SYMBOL),
            entities: newKeywordsList
          };
        });
      }

      const newKeywordsList = [];
      keywordsList.forEach(tempKeyword => {
        newKeywordsList.push({
          start: tempKeyword.start,
          end: tempKeyword.end,
          value: tempKeyword.value,
          entity: tempKeyword.keyword
        });
      });

      if (!categoryName) {
        saying.actions.forEach(actionName => {
          sayingsPerActions[actionName] = sayingsPerActions[actionName] === undefined ? 1 : sayingsPerActions[actionName] + 1;
        });
      }

      return {
        text: saying.userSays,
        intent: categoryName || saying.actions.join(_constants.RASA_INTENT_SPLIT_SYMBOL),
        entities: newKeywordsList
      };
    }

    if (!categoryName) {
      saying.actions.forEach(actionName => {
        sayingsPerActions[actionName] = sayingsPerActions[actionName] === undefined ? 1 : sayingsPerActions[actionName] + 1;
      });
    }

    return {
      text: saying.userSays,
      intent: categoryName || saying.actions.join(_constants.RASA_INTENT_SPLIT_SYMBOL),
      entities: []
    };
  })));
};

module.exports = async function ({
  keywords,
  sayings,
  extraTrainingData,
  categoryName = null
}) {
  const _ref = await this.server.services(),
        keywordService = _ref.keywordService;

  try {
    let keywordsCombinations = [];

    if (extraTrainingData && keywords.length > 0) {
      keywordsCombinations = await keywordService.combinationsFromSayings({
        keywords,
        sayings
      });
    }

    const sayingsPerActions = {};
    let commonExamplesUserSayings = [];

    if (sayings) {
      commonExamplesUserSayings = getCommonExamples(sayings, extraTrainingData, keywordsCombinations, categoryName, sayingsPerActions);
    }

    let commonExamplesModifiersSayings = [];

    if (!sayings) {
      const modifiersSayings = _lodash.default.flatten(_lodash.default.map(_lodash.default.flatten(_lodash.default.map(keywords, 'modifiers')), modifier => {
        return _lodash.default.map(modifier.sayings, saying => {
          saying.actions = [modifier.modifierName];
          return saying;
        });
      }));

      commonExamplesModifiersSayings = getCommonExamples(modifiersSayings, extraTrainingData, keywordsCombinations, categoryName, sayingsPerActions);
    }

    const actionsWithJustOneSaying = Object.keys(sayingsPerActions).filter(actionName => {
      return sayingsPerActions[actionName] === 1;
    });

    if (actionsWithJustOneSaying.length > 0) {
      return Promise.reject((0, _global.default)({
        actions: actionsWithJustOneSaying
      }));
    }

    let keywordSynonyms = _lodash.default.flatten(_lodash.default.map(keywords, keyword => {
      const synonyms = _lodash.default.map(keyword.examples, example => {
        const result = {};
        result.value = example.value;
        result.synonyms = _lodash.default.filter(example.synonyms, synonym => {
          return synonym !== example.value;
        });
        return result;
      });

      return _lodash.default.flatten(synonyms);
    }));

    keywordSynonyms = _lodash.default.filter(keywordSynonyms, keywordSynonym => {
      return keywordSynonym.synonyms.length > 0;
    });
    const regexs = [];
    keywords.forEach(ent => {
      if (ent.regex && ent.regex !== '') {
        regexs.push({
          name: ent.keywordName,
          pattern: ent.regex
        });
      }
    });
    return {
      sayingsPerActions,
      numberOfSayings: Object.keys(sayingsPerActions).length,
      [_constants.RASA_NLU_DATA]: {
        [_constants.RASA_COMMON_EXAMPLES]: commonExamplesUserSayings.concat(commonExamplesModifiersSayings),
        [_constants.RASA_REGEX_FEATURES]: regexs,
        [_constants.RASA_ENTITY_SYNONYMS]: keywordSynonyms
      }
    };
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.generate-training-data.service.js.map