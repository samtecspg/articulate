"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  agent = null,
  returnModel = false
}) {
  const redis = this.server.app.redis;
  const KeywordModel = await redis.factory(_constants.MODEL_KEYWORD);

  try {
    await KeywordModel.createInstance({
      data
    });

    if (agent) {
      await agent.link(KeywordModel, _constants.MODEL_KEYWORD);
      await agent.save();
    }

    return returnModel ? KeywordModel : KeywordModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=keyword.create.service.js.map