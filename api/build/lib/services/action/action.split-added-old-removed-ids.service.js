"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ({
  oldActions,
  newActions,
  AgentActionsModels
}) => {
  const oldIds = _lodash.default.map(_lodash.default.filter(AgentActionsModels, actionModel => {
    return oldActions.indexOf(actionModel.property('actionName')) > -1;
  }), filteredOldModel => {
    return filteredOldModel.id;
  });

  const newIds = _lodash.default.map(_lodash.default.filter(AgentActionsModels, actionModel => {
    return newActions.indexOf(actionModel.property('actionName')) > -1;
  }), filteredNewModel => {
    return filteredNewModel.id;
  });

  const removed = _lodash.default.difference(oldIds, newIds);

  const unchanged = _lodash.default.intersection(oldIds, newIds);

  const previousKeywords = [...unchanged, ...removed];

  const added = _lodash.default.difference(newIds, previousKeywords);

  return {
    added,
    removed,
    unchanged
  };
};
//# sourceMappingURL=action.split-added-old-removed-ids.service.js.map