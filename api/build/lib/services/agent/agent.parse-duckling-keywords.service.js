"use strict";

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  AgentModel,
  text,
  timezone,
  ducklingURL
}) {
  const _ref = await this.server.services(),
        ducklingService = _ref.ducklingService;

  const startTime = new _moment.default();
  timezone = timezone || AgentModel.property('timezone');
  const ducklingParseResponse = await ducklingService.parse({
    text,
    timezone,
    language: AgentModel.property('language'),
    baseURL: ducklingURL
  });
  const endTime = new _moment.default();

  const duration = _moment.default.duration(endTime.diff(startTime), 'ms').asMilliseconds();

  return ducklingParseResponse.map(ducklingParse => {
    return _objectSpread({}, ducklingParse, {
      elapsed_time_ms: duration / ducklingParseResponse.length
    });
  });
};
//# sourceMappingURL=agent.parse-duckling-keywords.service.js.map