"use strict";

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  frameData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        contextService = _ref.contextService,
        frameService = _ref.frameService;

  try {
    const ContextModel = await contextService.findBySession({
      sessionId,
      returnModel: true
    });
    return await frameService.create({
      context: ContextModel,
      data: frameData,
      returnModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.create-frame.service.js.map