"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/export`,
  options: {
    tags: ['api'],
    validate: _agent.default.export,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const id = request.params[_constants.PARAM_AGENT_ID];

      try {
        return await agentService.export({
          id
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
//# sourceMappingURL=agent.export.route.js.map