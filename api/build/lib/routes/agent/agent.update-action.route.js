"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create-action` });
module.exports = {
  method: ['put'],
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_ACTION}/{${_constants.PARAM_ACTION_ID}}`,
  options: {
    tags: ['api'],
    validate: _agent.default.updateAction,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const _request$params = request.params,
            id = _request$params[_constants.PARAM_AGENT_ID],
            actionId = _request$params[_constants.PARAM_ACTION_ID];

      try {
        return await agentService.updateAction({
          id,
          actionId,
          actionData: request.payload
        });
      } catch (_ref2) {
        let message = _ref2.message;
        let statusCode = _ref2.statusCode;
        return new _boom.default(message, {
          statusCode
        });
      }
    }
  }
};
//# sourceMappingURL=agent.update-action.route.js.map