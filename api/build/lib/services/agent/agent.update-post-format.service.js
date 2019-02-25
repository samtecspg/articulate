"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  postFormatData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  try {
    const AgentModel = await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    });
    const ids = await AgentModel.getAll(_constants.MODEL_POST_FORMAT, _constants.MODEL_POST_FORMAT);
    const PostFormatModel = await globalService.findById({
      id: ids[0],
      model: _constants.MODEL_POST_FORMAT,
      returnModel: true
    });

    if (PostFormatModel.inDb) {
      await PostFormatModel.updateInstance({
        data: postFormatData
      });
      return returnModel ? PostFormatModel : PostFormatModel.allProperties();
    }

    return Promise.reject((0, _global.default)({
      model: _constants.MODEL_POST_FORMAT
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.update-post-format.service.js.map