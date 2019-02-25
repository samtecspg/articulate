"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  sessionId,
  data,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const Model = await redis.factory(_constants.MODEL_CONTEXT);

  try {
    await Model.findBySessionId({
      sessionId
    });

    if (Model.inDb) {
      await Model.updateInstance({
        data
      });
      return returnModel ? Model : Model.allProperties();
    }

    return Promise.reject(NotFoundErrorHandler({
      model: _constants.MODEL_CONTEXT,
      id: sessionId
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=context.update.service.js.map