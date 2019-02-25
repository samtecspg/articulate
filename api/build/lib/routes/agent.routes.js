"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../util/constants");

var _globalFindAll = _interopRequireDefault(require("./global/global.find-all.route"));

var _globalFindById = _interopRequireDefault(require("./global/global.find-by-id.route"));

var _globalFindInModelPath = _interopRequireDefault(require("./global/global.find-in-model-path.route"));

var _globalSearchByField = _interopRequireDefault(require("./global/global.search-by-field.route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Routes = require('require-dir')('./agent');

module.exports = [..._lodash.default.values(Routes), (0, _globalFindAll.default)({
  ROUTE: _constants.ROUTE_AGENT
}), (0, _globalFindById.default)({
  ROUTE: _constants.ROUTE_AGENT
}), (0, _globalSearchByField.default)({
  ROUTE: _constants.ROUTE_AGENT
}), (0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_ACTION]
}), //agent/{agentId}/action
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_ACTION],
  isFindById: true
}), //agent/{agentId}/action/{actionId}
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_ACTION, _constants.MODEL_POST_FORMAT],
  isSingleResult: true
}), //agent/{agentId}/action/{actionId}/postFormat
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_ACTION, _constants.MODEL_WEBHOOK],
  isSingleResult: true
}), //agent/{agentId}/action/{actionId}/webhook
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY]
}), //agent/{agentId}/category
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY],
  isFindById: true
}), //agent/{agentId}/category/{categoryId}
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY, _constants.MODEL_SAYING]
}), //agent/{agentId}/category/{categoryId}/saying
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY, _constants.MODEL_SAYING],
  isFindById: true
}), //agent/{agentId}/category/{categoryId}/saying/{sayingId}
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD]
}), //agent/{agentId}/keyword
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD],
  isFindById: true
}), //agent/{agentId}/keyword/{keywordId}
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD, _constants.MODEL_ACTION]
}), //agent/{agentId}/keyword/{keywordId}/action
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_KEYWORD, _constants.MODEL_SAYING]
}), //agent/{agentId}/keyword/{keywordId}/saying
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_WEBHOOK],
  isSingleResult: true
}), //agent/{agentId}/webhook
(0, _globalFindInModelPath.default)({
  models: [_constants.MODEL_AGENT, _constants.MODEL_POST_FORMAT],
  isSingleResult: true
}) //agent/{agentId}/postFormat
];
//# sourceMappingURL=agent.routes.js.map