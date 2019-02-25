"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_SAYING}`,
  options: {
    tags: ['api'],
    validate: _agent.default.findAllSayings,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const id = request.params[_constants.PARAM_AGENT_ID];
      const _request$query = request.query,
            skip = _request$query[_constants.PARAM_SKIP],
            limit = _request$query[_constants.PARAM_LIMIT],
            direction = _request$query[_constants.PARAM_DIRECTION],
            field = _request$query[_constants.PARAM_FIELD],
            filter = _request$query[_constants.PARAM_FILTER],
            loadCategoryId = _request$query.loadCategoryId;

      try {
        return await agentService.findAllSayings({
          id,
          loadCategoryId,
          skip,
          limit,
          direction,
          field,
          filter
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
//# sourceMappingURL=agent.find-all-sayings.route.js.map