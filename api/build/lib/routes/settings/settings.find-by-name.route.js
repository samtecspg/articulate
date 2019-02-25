"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _settings = _interopRequireDefault(require("../../validators/settings.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_SETTINGS}/{${_constants.PARAM_NAME}}`,
  options: {
    tags: ['api'],
    validate: _settings.default.findByName,
    handler: async request => {
      const _ref = await request.services(),
            settingsService = _ref.settingsService;

      const name = request.params[_constants.PARAM_NAME];

      try {
        return await settingsService.findByName({
          name
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
//# sourceMappingURL=settings.find-by-name.route.js.map