"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _contextCreateFrame = _interopRequireDefault(require("./context/context.create-frame.service"));

var _contextCreate = _interopRequireDefault(require("./context/context.create.service"));

var _contextFindBySession = _interopRequireDefault(require("./context/context.find-by-session.service"));

var _contextFindFrameBySessionAndFrame = _interopRequireDefault(require("./context/context.find-frame-by-session-and-frame.service"));

var _contextFindFramesBySession = _interopRequireDefault(require("./context/context.find-frames-by-session.service"));

var _contextRemoveBySession = _interopRequireDefault(require("./context/context.remove-by-session.service"));

var _contextRemoveFramesBySessionAndFrame = _interopRequireDefault(require("./context/context.remove-frames-by-session-and-frame.service"));

var _contextRemoveFramesBySession = _interopRequireDefault(require("./context/context.remove-frames-by-session.service"));

var _contextUpdateFrameBySessionAndFrame = _interopRequireDefault(require("./context/context.update-frame-by-session-and-frame.service"));

var _contextUpdate = _interopRequireDefault(require("./context/context.update.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class ContextService extends _schmervice.default.Service {
  async create() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _contextCreate.default,
      name: 'ContextService.create'
    }).apply(this, arguments);
  }

  async createFrame() {
    return await _contextCreateFrame.default.apply(this, arguments);
  }

  async updateFrameBySessionAndFrame() {
    return await _contextUpdateFrameBySessionAndFrame.default.apply(this, arguments);
  }

  async update() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _contextUpdate.default,
      name: 'ContextService.update'
    }).apply(this, arguments);
  }

  async findBySession() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _contextFindBySession.default,
      name: 'ContextService.findBySession'
    }).apply(this, arguments);
  }

  async findFramesBySession() {
    return await _contextFindFramesBySession.default.apply(this, arguments);
  }

  async findFrameBySessionAndFrame() {
    return await _contextFindFrameBySessionAndFrame.default.apply(this, arguments);
  }

  async createFrame() {
    return await _contextCreateFrame.default.apply(this, arguments);
  }

  async removeBySession() {
    return await _contextRemoveBySession.default.apply(this, arguments);
  }

  async removeFramesBySessionId() {
    return await _contextRemoveFramesBySession.default.apply(this, arguments);
  }

  async removeFramesBySessionIdAndFrameId() {
    return await _contextRemoveFramesBySessionAndFrame.default.apply(this, arguments);
  }

};
//# sourceMappingURL=context.services.js.map