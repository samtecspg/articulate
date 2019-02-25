"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ({
  ducklingData,
  ducklingDimension
}) {
  const replacer = (key, value) => {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return value.toString();
    }

    return value;
  };

  const ducklingKeywords = _lodash.default.map(ducklingData, keyword => {
    if (ducklingDimension.indexOf(keyword.dim) !== -1) {
      return {
        end: keyword.end,
        keyword: 'sys.duckling_' + keyword.dim,
        extractor: 'duckling',
        start: keyword.start,
        value: JSON.parse(JSON.stringify(keyword.value, replacer))
      };
    }

    return null;
  });

  return _lodash.default.compact(ducklingKeywords);
};
//# sourceMappingURL=keyword.parse-system-keywords-duckling.service.js.map