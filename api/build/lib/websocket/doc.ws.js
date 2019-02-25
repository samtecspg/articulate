"use strict";

var _constants = require("../../util/constants");

module.exports = {
  model: _constants.MODEL_DOCUMENT,
  subscribePath: `/${_constants.ROUTE_AGENT}/{id}/${_constants.ROUTE_DOCUMENT}`,
  actions: [_constants.NOHM_SUB_SAVE],
  isESModel: true
};
//# sourceMappingURL=doc.ws.js.map