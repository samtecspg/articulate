"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });
module.exports = {
  method: ['delete'],
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_CATEGORY}/{${_constants.PARAM_CATEGORY_ID}}/${_constants.ROUTE_SAYING}/{${_constants.PARAM_SAYING_ID}}`,
  options: {
    tags: ['api'],
    validate: _agent.default.removeSayingInCategory,
    handler: async (request, h) => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const _request$params = request.params,
            agentId = _request$params[_constants.PARAM_AGENT_ID],
            categoryId = _request$params[_constants.PARAM_CATEGORY_ID],
            sayingId = _request$params[_constants.PARAM_SAYING_ID];

      try {
        await agentService.removeSayingInCategory({
          id: agentId,
          categoryId,
          sayingId
        });
        return h.continue;
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
//# sourceMappingURL=agent.remove-saying-in-domain.route.js.map