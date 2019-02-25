"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _rasaNluParse = _interopRequireDefault(require("./rasa-nlu/rasa-nlu.parse.service"));

var _rasaNluTrain = _interopRequireDefault(require("./rasa-nlu/rasa-nlu.train.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class RasaNLUService extends _schmervice.default.Service {
  async train() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _rasaNluTrain.default,
      name: 'RasaNLUService.train'
    }).apply(this, arguments);
  }

  async parse() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _rasaNluParse.default,
      name: 'RasaNLUService.parse'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=rasa-nlu.services.js.map