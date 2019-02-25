"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  AgentModel = null,
  keywordData,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        keywordService = _ref.keywordService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    }));
    return await keywordService.create({
      data: keywordData,
      agent: AgentModel,
      returnModel
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.create-keyword.service.js.map