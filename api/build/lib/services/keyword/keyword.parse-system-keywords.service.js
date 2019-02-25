"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  parseResult,
  spacyPretrainedEntities,
  ducklingDimension
}) {
  const _ref = await this.server.services(),
        keywordService = _ref.keywordService;

  const ducklingKeywords = keywordService.parseSystemKeywordsDuckling({
    ducklingData: parseResult.duckling,
    ducklingDimension
  });
  const regexKeywords = keywordService.parseSystemKeywordsRegex({
    regexData: parseResult.regex
  });
  return _lodash.default.map(parseResult.rasa, rasaResult => {
    let rasaKeywords = _lodash.default.map(rasaResult.keywords, keyword => {
      if (keyword.extractor === 'ner_spacy') {
        if (spacyPretrainedEntities.indexOf(keyword.keyword) !== -1) {
          keyword.keyword = 'sys.spacy_' + keyword.keyword.toLowerCase();
        } else {
          return null;
        }
      }

      keyword.value = {
        value: keyword.value
      };
      return keyword;
    });

    rasaKeywords = _lodash.default.compact(rasaKeywords); //TODO: IF there is more than one rasa result then this will contain repeated data

    rasaResult.keywords = _lodash.default.union(rasaKeywords, ducklingKeywords, regexKeywords);
    return rasaResult;
  });
};
//# sourceMappingURL=keyword.parse-system-keywords.service.js.map