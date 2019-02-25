"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _context = _interopRequireDefault(require("../../validators/context.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_CONTEXT}/{${_constants.PARAM_SESSION}}`,
  options: {
    tags: ['api'],
    validate: _context.default.findBySession,
    handler: async request => {
      const _ref = await request.services(),
            contextService = _ref.contextService;

      const sessionId = request.params[_constants.PARAM_SESSION];
      const loadFrames = request.query[_constants.PARAM_LOAD_FRAMES];

      try {
        return await contextService.findBySession({
          sessionId,
          loadFrames
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
//# sourceMappingURL=context.find-by-session.route.js.map