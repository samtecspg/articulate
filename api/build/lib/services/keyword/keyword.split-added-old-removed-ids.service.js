"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ({
  oldKeywords,
  newKeywords
}) => {
  const newIds = _lodash.default.map((0, _lodash.default)(newKeywords).map('keywordId').uniq().value(), id => id.toString());

  const oldIds = _lodash.default.map((0, _lodash.default)(oldKeywords).map('keywordId').uniq().value(), id => id.toString());

  const removed = _lodash.default.difference(oldIds, newIds);

  const unchanged = _lodash.default.intersection(oldIds, newIds);

  const previousKeywords = [...unchanged, ...removed];

  const added = _lodash.default.difference(newIds, previousKeywords);

  const addedNonSystem = (0, _lodash.default)(newKeywords).filter(keyword => !!!keyword.extractor) //Only Non system
  .filter(keyword => _lodash.default.includes(added, keyword.keywordId)) // Only new (ignore unchanged)
  .map(keyword => keyword.keywordId.toString()).uniq().value();
  return {
    added,
    addedNonSystem,
    removed,
    unchanged
  };
};
//# sourceMappingURL=keyword.split-added-old-removed-ids.service.js.map