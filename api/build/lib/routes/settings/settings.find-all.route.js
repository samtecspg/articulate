"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import AgentValidator from '../../validators/agent.validator';
//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'get',
  path: `/${_constants.ROUTE_SETTINGS}`,
  options: {
    tags: ['api'],
    handler: async request => {
      const _ref = await request.services(),
            settingsService = _ref.settingsService;

      try {
        return await settingsService.findAll();
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
//# sourceMappingURL=settings.find-all.route.js.map