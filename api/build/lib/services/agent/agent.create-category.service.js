"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  categoryData,
  AgentModel = null,
  returnModel = false
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        categoryService = _ref.categoryService,
        agentService = _ref.agentService;

  try {
    AgentModel = AgentModel || (await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    }));
    const isValid = await agentService.isModelUnique({
      AgentModel,
      model: _constants.MODEL_CATEGORY,
      field: 'categoryName',
      value: categoryData.categoryName
    });

    if (isValid) {
      return await categoryService.create({
        data: categoryData,
        agent: AgentModel,
        returnModel
      });
    }

    return Promise.reject((0, _global.default)({
      message: `The ${_constants.MODEL_AGENT} already has a ${_constants.MODEL_CATEGORY} with the name= "${categoryData.categoryName}".`
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.create-category.service.js.map