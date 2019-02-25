"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _agent = _interopRequireDefault(require("../../validators/agent.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

//const logger = require('../../../server/util/logger')({ name: `route:agent:create` });
module.exports = {
  method: 'post',
  path: `/${_constants.ROUTE_AGENT}/{${_constants.PARAM_AGENT_ID}}/${_constants.ROUTE_CONVERSE}`,
  options: {
    tags: ['api'],
    validate: _agent.default.converse,
    handler: async request => {
      const _ref = await request.services(),
            agentService = _ref.agentService;

      const agentId = request.params[_constants.PARAM_AGENT_ID];

      const _request$payload = request.payload,
            text = _request$payload[_constants.PARAM_TEXT],
            timezone = _request$payload[_constants.PARAM_TIMEZONE],
            sessionId = _request$payload[_constants.PARAM_SESSION],
            rest = _objectWithoutProperties(_request$payload, [_constants.PARAM_TEXT, _constants.PARAM_TIMEZONE, _constants.PARAM_SESSION]);

      const debug = request.query[_constants.PARAM_DEBUG];

      try {
        return await agentService.converse({
          id: agentId,
          text,
          timezone,
          sessionId,
          debug,
          additionalKeys: rest,
          requestId: Date.now()
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
//# sourceMappingURL=agent.converse.route.js.map