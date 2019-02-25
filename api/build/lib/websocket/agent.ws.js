"use strict";

var _constants = require("../../util/constants");

module.exports = {
  model: _constants.MODEL_AGENT,
  subscribePath: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}`,
  publishPath: ({
    properties
  }) => `/${_constants.ROUTE_AGENT}/${properties.id}`,
  actions: [_constants.NOHM_SUB_SAVE]
};
//# sourceMappingURL=agent.ws.js.map