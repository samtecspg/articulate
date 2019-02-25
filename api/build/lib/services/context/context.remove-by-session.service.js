"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId
}) {
  const redis = this.server.app.redis;

  try {
    const Model = await redis.factory(_constants.MODEL_CONTEXT);
    await Model.findBySessionId({
      sessionId
    });

    if (Model.inDb) {
      return await Model.removeInstance();
    }

    return Promise.reject((0, _global.default)({
      model: _constants.MODEL_CONTEXT,
      id: sessionId
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.remove-by-session.service.js.map