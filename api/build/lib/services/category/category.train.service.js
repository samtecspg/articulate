"use strict";

var _guid = _interopRequireDefault(require("guid"));

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  AgentModel,
  CategoryModel,
  returnModel = false
}) {
  const agent = AgentModel.allProperties();
  const category = CategoryModel.allProperties();

  const _ref = await this.server.services(),
        categoryService = _ref.categoryService,
        globalService = _ref.globalService,
        rasaNLUService = _ref.rasaNLUService;

  let model = _guid.default.create().toString();

  try {
    const keywords = await globalService.loadAllByIds({
      ids: await CategoryModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
      model: _constants.MODEL_KEYWORD
    });
    const sayings = await globalService.loadAllByIds({
      ids: await CategoryModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING),
      model: _constants.MODEL_SAYING
    });
    const trainingData = await categoryService.generateTrainingData({
      keywords,
      sayings,
      extraTrainingData: category.extraTrainingData
    });
    const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[_constants.CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[_constants.CONFIG_SETTINGS_SAYING_PIPELINE];
    model = (trainingData.numberOfSayings === 1 ? _constants.RASA_MODEL_JUST_ER : '') + model;
    model = category.categoryName + '_' + model;
    CategoryModel.property('status', _constants.STATUS_TRAINING);
    await CategoryModel.saveInstance();
    await rasaNLUService.train({
      project: agent.agentName,
      model,
      oldModel: category.model || null,
      trainingSet: {
        [_constants.RASA_NLU_DATA]: trainingData[_constants.RASA_NLU_DATA]
      },
      pipeline,
      language: agent.language,
      baseURL: agent.settings[_constants.CONFIG_SETTINGS_RASA_URL]
    });
    CategoryModel.property('lastTraining', (0, _moment.default)().utc().format());
    CategoryModel.property('model', model);
    CategoryModel.property('status', _constants.STATUS_READY);
    await CategoryModel.saveInstance();
    return returnModel ? CategoryModel : CategoryModel.allProperties();
  } catch (error) {
    CategoryModel.property('status', _constants.STATUS_ERROR);
    await CategoryModel.saveInstance();
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=category.train.service.js.map