"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _frameCreate = _interopRequireDefault(require("./frame/frame.create.service"));

var _frameUpdate = _interopRequireDefault(require("./frame/frame.update.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class FrameService extends _schmervice.default.Service {
  async create() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _frameCreate.default,
      name: 'FrameService.create'
    }).apply(this, arguments);
  }

  async update() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _frameUpdate.default,
      name: 'FrameService.update'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=frame.services.js.map