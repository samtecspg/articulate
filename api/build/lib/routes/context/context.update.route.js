"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _context = _interopRequireDefault(require("../../validators/context.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'patch',
  path: `/${_constants.ROUTE_CONTEXT}/{${_constants.PARAM_SESSION}}`,
  options: {
    tags: ['api'],
    validate: _context.default.update,
    handler: async request => {
      const _ref = await request.services(),
            contextService = _ref.contextService;

      const sessionId = request.params[_constants.PARAM_SESSION];

      try {
        return await contextService.update({
          sessionId,
          data: request.payload
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
//# sourceMappingURL=context.update.route.js.map