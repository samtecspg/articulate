"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _context = _interopRequireDefault(require("../../validators/context.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'delete',
  path: `/${_constants.ROUTE_CONTEXT}/{${_constants.PARAM_SESSION}}/${_constants.ROUTE_FRAME}`,
  options: {
    tags: ['api'],
    validate: _context.default.removeBySession,
    handler: async (request, h) => {
      const _ref = await request.services(),
            contextService = _ref.contextService;

      const sessionId = request.params[_constants.PARAM_SESSION];

      try {
        await contextService.removeFramesBySessionId({
          sessionId
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
//# sourceMappingURL=context.remove-frames-by-session.route.js.map