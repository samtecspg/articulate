"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;

  try {
    const PostFormatModel = await redis.factory(_constants.MODEL_POST_FORMAT, id);
    return PostFormatModel.removeInstance({
      id
    });
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${_constants.MODEL_POST_FORMAT} id=[${id}]`
    });
  }
};
//# sourceMappingURL=post-format.remove.service.js.map