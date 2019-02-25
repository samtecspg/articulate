"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const homogenize = combination => {
  return _lodash.default.map(_lodash.default.orderBy(combination, 'keywordText'), 'keywordText').join(',');
};

const removeDuplicatesAndRepeatedValues = keywordsCombinations => {
  let cleanKeywordsCombinations = _lodash.default.uniqBy(keywordsCombinations, homogenize);

  cleanKeywordsCombinations = _lodash.default.filter(cleanKeywordsCombinations, combination => {
    const countOfDifferentTexts = _lodash.default.countBy(combination, 'keywordText');

    return combination.length === Object.keys(countOfDifferentTexts).length;
  });
  return cleanKeywordsCombinations;
};

module.exports = async function ({
  keywords,
  sayings
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  const usedKeywordsBySayings = _lodash.default.compact(_lodash.default.uniq(_lodash.default.map(_lodash.default.map(sayings, saying => {
    if (saying.keywords) {
      return _lodash.default.compact(_lodash.default.map(saying.keywords, keyword => {
        return keyword.extractor ? null : keyword.keyword;
      }));
    }

    return null;
  }), tuple => {
    return tuple.join('-');
  })));

  const modifiersSayings = _lodash.default.flatten(_lodash.default.map(_lodash.default.flatten(_lodash.default.map(keywords, 'modifiers')), 'sayings'));

  const usedKeywordsByModifiers = _lodash.default.compact(_lodash.default.uniq(_lodash.default.map(_lodash.default.map(modifiersSayings, saying => {
    if (saying.keywords) {
      return _lodash.default.compact(_lodash.default.map(saying.keywords, keyword => {
        return keyword.extractor ? null : keyword.keyword;
      }));
    }

    return null;
  }), tuple => {
    return tuple.join('-');
  })));

  const usedKeywords = _lodash.default.uniq(usedKeywordsBySayings.concat(usedKeywordsByModifiers));

  const combinations = {};
  await Promise.all(_lodash.default.map(usedKeywords, async key => {
    const tupleOfKeywords = key.split('-');

    if (!combinations[key]) {
      const keywordsList = _lodash.default.map(tupleOfKeywords, keyword => {
        const matchedKeyword = _lodash.default.filter(keywords, fullKeyword => {
          return fullKeyword.keywordName === keyword;
        })[0];

        return _lodash.default.flatten(_lodash.default.map(matchedKeyword.examples, entry => {
          if (entry.synonyms && entry.synonyms.length > 0) {
            return _lodash.default.map(entry.synonyms, synonym => {
              return {
                keywordValue: entry.value,
                keywordText: synonym
              };
            });
          }

          return [{
            keywordValue: entry.value,
            keywordText: entry.value
          }];
        }));
      });

      let keywordsCombinations;

      if (keywordsList.length > 1 && Array.isArray(keywordsList[0])) {
        keywordsCombinations = await globalService.cartesianProduct(keywordsList);
        keywordsCombinations = removeDuplicatesAndRepeatedValues(keywordsCombinations);
      } else {
        keywordsCombinations = keywordsList;
      }

      combinations[key] = keywordsCombinations;
    }
  }));
  return combinations;
};
//# sourceMappingURL=keyword.combinations-from-sayings.service.js.map