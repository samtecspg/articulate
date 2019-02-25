"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _context = _interopRequireDefault(require("../../validators/context.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_CONTEXT}/{${_constants.PARAM_SESSION}}/${_constants.ROUTE_FRAME}/{${_constants.PARAM_FRAME}}`,
  options: {
    tags: ['api'],
    validate: _context.default.findFrameBySessionAndFrame,
    handler: async request => {
      const _ref = await request.services(),
            contextService = _ref.contextService;

      const _request$params = request.params,
            sessionId = _request$params[_constants.PARAM_SESSION],
            frameId = _request$params[_constants.PARAM_FRAME];

      try {
        return await contextService.findFrameBySessionAndFrame({
          sessionId,
          frameId
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
//# sourceMappingURL=context.find-frame-by-session-and-frame.route.js.map