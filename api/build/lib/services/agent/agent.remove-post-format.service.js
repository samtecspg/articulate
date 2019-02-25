"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  const PostFormatModel = await redis.factory(_constants.MODEL_POST_FORMAT);

  try {
    const agent = await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    });
    const ids = await agent.getAll(_constants.MODEL_POST_FORMAT, _constants.MODEL_POST_FORMAT);
    await Promise.all(ids.map(async currentId => {
      return await PostFormatModel.removeInstance({
        id: currentId
      });
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.remove-post-format.service.js.map