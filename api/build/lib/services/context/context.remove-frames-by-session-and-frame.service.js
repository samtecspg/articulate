"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  frameId
}) {
  const _ref = await this.server.services(),
        contextService = _ref.contextService;

  try {
    const Frame = await contextService.findFrameBySessionAndFrame({
      sessionId,
      frameId,
      returnModel: true
    });

    if (Frame.inDb) {
      await Frame.removeInstance();
    } else {
      return Promise.reject(NotFoundErrorHandler({
        model: _constants.MODEL_FRAME,
        id: frameId
      }));
    }
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.remove-frames-by-session-and-frame.service.js.map