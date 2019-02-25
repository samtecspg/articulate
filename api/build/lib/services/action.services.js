"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _actionRemove = _interopRequireDefault(require("./action/action.remove.service"));

var _actionUpsert = _interopRequireDefault(require("./action/action.upsert.service"));

var _actionSplitAddedOldRemovedIds = _interopRequireDefault(require("./action/action.split-added-old-removed-ids.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class ActionService extends _schmervice.default.Service {
  async upsert() {
    return await _actionUpsert.default.apply(this, arguments);
  }

  async remove() {
    return await _actionRemove.default.apply(this, arguments);
  }

  splitAddedOldRemovedIds() {
    return _actionSplitAddedOldRemovedIds.default.apply(this, arguments);
  }

};
//# sourceMappingURL=action.services.js.map