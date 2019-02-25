"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _context = _interopRequireDefault(require("../../validators/context.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_CONTEXT}/{${_constants.PARAM_SESSION}}/${_constants.ROUTE_FRAME}`,
  options: {
    tags: ['api'],
    validate: _context.default.findFramesBySession,
    handler: async request => {
      const _ref = await request.services(),
            contextService = _ref.contextService;

      const sessionId = request.params[_constants.PARAM_SESSION];
      const _request$query = request.query,
            skip = _request$query.skip,
            limit = _request$query.limit,
            direction = _request$query.direction,
            field = _request$query.field;

      try {
        return await contextService.findFramesBySession({
          sessionId,
          skip,
          limit,
          direction,
          field
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
//# sourceMappingURL=context.find-frames-by-session.route.js.map