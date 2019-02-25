"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'post',
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_PARSE}`,
  options: {
    tags: ['api'],
    validate: _agent.default.parsePost,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const agentId = request.params[_constants.PARAM_AGENT_ID];
      const _request$payload = request.payload,
            text = _request$payload.text,
            timezone = _request$payload.timezone;

      try {
        return await agentService.parse({
          id: agentId,
          text,
          timezone
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
//# sourceMappingURL=agent.parse-post.route.js.map