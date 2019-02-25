"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create-webhook` });
module.exports = {
  method: ['post'],
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_CATEGORY}/{${_constants.PARAM_CATEGORY_ID}}/${_constants.ROUTE_SAYING}`,
  options: {
    tags: ['api'],
    validate: _agent.default.createSayingInCategory,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const _request$params = request.params,
            agentId = _request$params[_constants.PARAM_AGENT_ID],
            categoryId = _request$params[_constants.PARAM_CATEGORY_ID];

      try {
        return await agentService.upsertSayingInCategory({
          id: agentId,
          categoryId,
          sayingId: null,
          sayingData: request.payload
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
//# sourceMappingURL=agent.create-saying-in-domain.route.js.map