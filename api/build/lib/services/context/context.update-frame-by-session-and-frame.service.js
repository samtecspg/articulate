"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  frameId,
  frameData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        contextService = _ref.contextService,
        frameService = _ref.frameService;

  try {
    const Frame = await contextService.findFrameBySessionAndFrame({
      sessionId,
      frameId,
      returnModel: true
    });

    if (Frame.inDb) {
      return await frameService.update({
        id: frameId,
        data: frameData,
        returnModel
      });
    }

    return Promise.reject(NotFoundErrorHandler({
      model: MODEL_FRAME,
      id: frameId
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.update-frame-by-session-and-frame.service.js.map