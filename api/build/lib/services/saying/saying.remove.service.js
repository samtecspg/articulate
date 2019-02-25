"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.default-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id = null,
  SayingModel = null,
  AgentModel,
  CategoryModel
}) {
  const redis = this.server.app.redis;

  const _this$server$services = this.server.services(),
        categoryService = _this$server$services.categoryService,
        globalService = _this$server$services.globalService;

  if (id === null && SayingModel === null) {
    return Promise.reject((0, _global.default)({
      message: 'Saying id or model needed'
    }));
  }

  try {
    SayingModel = SayingModel || (await redis.factory(_constants.MODEL_SAYING, id));

    const removedKeywordIds = _lodash.default.map(SayingModel.property('keywords'), 'keywordId');

    const removedKeywordModels = await globalService.loadAllByIds({
      ids: removedKeywordIds,
      //Only load the keywords we are going to use
      model: _constants.MODEL_KEYWORD,
      returnModel: true
    });
    await categoryService.unlinkKeywords({
      model: CategoryModel,
      keywordModels: removedKeywordModels
    }); // Update status

    AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    CategoryModel.property('status', _constants.STATUS_OUT_OF_DATE);
    await AgentModel.saveInstance();
    await CategoryModel.saveInstance();
    return await SayingModel.removeInstance();
  } catch (error) {
    throw (0, _redis.default)({
      error,
      message: `${_constants.MODEL_KEYWORD} id=[${id}]`
    });
  }
};
//# sourceMappingURL=saying.remove.service.js.map