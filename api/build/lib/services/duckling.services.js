"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _ducklingConvertInterval = _interopRequireDefault(require("./duckling/duckling.convert-interval.service"));

var _ducklingParse = _interopRequireDefault(require("./duckling/duckling.parse.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class DucklingService extends _schmervice.default.Service {
  async convertToInterval() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _ducklingConvertInterval.default,
      name: 'DucklingService.convertToInterval'
    }).apply(this, arguments);
  }

  async parse() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _ducklingParse.default,
      name: 'DucklingService.parse'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=duckling.services.js.map