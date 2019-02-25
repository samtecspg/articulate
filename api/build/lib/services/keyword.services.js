"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _keywordCombinationsFromSayings = _interopRequireDefault(require("./keyword/keyword.combinations-from-sayings.service"));

var _keywordCreate = _interopRequireDefault(require("./keyword/keyword.create.service"));

var _keywordParseSysValue = _interopRequireDefault(require("./keyword/keyword.parse-sys-value.service"));

var _keywordParseSystemKeywordsDuckling = _interopRequireDefault(require("./keyword/keyword.parse-system-keywords-duckling.service"));

var _keywordParseSystemKeywordsRegex = _interopRequireDefault(require("./keyword/keyword.parse-system-keywords-regex.service"));

var _keywordParseSystemKeywords = _interopRequireDefault(require("./keyword/keyword.parse-system-keywords.service"));

var _keywordRemove = _interopRequireDefault(require("./keyword/keyword.remove.service"));

var _keywordSplitAddedOldRemovedIds = _interopRequireDefault(require("./keyword/keyword.split-added-old-removed-ids.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class KeywordService extends _schmervice.default.Service {
  async create() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _keywordCreate.default,
      name: 'KeywordService.create'
    }).apply(this, arguments);
  }

  async remove() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _keywordRemove.default,
      name: 'KeywordService.remove'
    }).apply(this, arguments);
  }

  splitAddedOldRemovedIds() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordSplitAddedOldRemovedIds.default,
      name: 'KeywordService.splitAddedOldRemovedIds'
    }).apply(this, arguments);
  }

  combinationsFromSayings() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordCombinationsFromSayings.default,
      name: 'KeywordService.combinationsFromSayings'
    }).apply(this, arguments);
  }

  parseSystemKeywords() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordParseSystemKeywords.default,
      name: 'KeywordService.parseSystemKeywords'
    }).apply(this, arguments);
  }

  parseSystemKeywordsDuckling() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordParseSystemKeywordsDuckling.default,
      name: 'KeywordService.parseSystemKeywordsDuckling'
    }).apply(this, arguments);
  }

  parseSystemKeywordsRegex() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordParseSystemKeywordsRegex.default,
      name: 'KeywordService.parseSystemKeywordsRegex'
    }).apply(this, arguments);
  }

  parseSysValue() {
    return (0, _serviceTimingWrapper.default)({
      fn: _keywordParseSysValue.default,
      name: 'KeywordService.parseSysValue'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=keyword.services.js.map