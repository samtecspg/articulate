"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _settings = _interopRequireDefault(require("../../validators/settings.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'put',
  path: `/${_constants.ROUTE_SETTINGS}/${_constants.PARAM_BULK}`,
  options: {
    tags: ['api'],
    description: 'Bulk update settings',
    validate: _settings.default.updateAll,
    handler: async request => {
      const _ref = await request.services(),
            settingsService = _ref.settingsService;

      try {
        return await settingsService.bulkUpdate({
          settingsData: request.payload
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
//# sourceMappingURL=settings.bulk-update-settings.route.js.map