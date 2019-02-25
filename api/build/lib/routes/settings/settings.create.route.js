"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _settings = _interopRequireDefault(require("../../validators/settings.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'post',
  path: `/${_constants.ROUTE_SETTINGS}`,
  options: {
    tags: ['api'],
    validate: _settings.default.create,
    handler: async request => {
      const _ref = await request.services(),
            settingsService = _ref.settingsService;

      try {
        return await settingsService.create({
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
//# sourceMappingURL=settings.create.route.js.map