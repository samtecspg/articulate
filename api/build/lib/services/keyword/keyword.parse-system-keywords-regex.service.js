"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ({
  regexData
}) {
  return _lodash.default.map(regexData, keyword => {
    let tmpKeyword = {};

    if (keyword.regexType === 'sysRegex') {
      tmpKeyword = {
        end: keyword.end,
        keyword: 'sys.regex_' + keyword.name,
        extractor: 'regex',
        start: keyword.start,
        value: keyword.resolvedRegex
      };
    } else if (keyword.regexType === 'keywordRegex') {
      tmpKeyword = {
        end: keyword.end,
        keyword: keyword.name,
        extractor: 'regex',
        start: keyword.start,
        value: keyword.keywordValue
      };
    }

    return tmpKeyword;
  });
};
//# sourceMappingURL=keyword.parse-system-keywords-regex.service.js.map