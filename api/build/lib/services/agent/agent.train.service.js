"use strict";

var _guid = _interopRequireDefault(require("guid"));

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

var _global = _interopRequireDefault(require("../../errors/global.invalid-agent-train"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const generateTrainingDataForCategoriesRecognizer = async ({
  AgentModel,
  CategoryModels,
  globalService,
  categoryService,
  enableModelsPerCategory
}) => {
  let countOfCategoriesWithData = 0;
  let rasaNLUData = {
    [_constants.RASA_COMMON_EXAMPLES]: [],
    [_constants.RASA_REGEX_FEATURES]: [],
    [_constants.RASA_ENTITY_SYNONYMS]: []
  };

  if (enableModelsPerCategory) {
    for (let CategoryModel of CategoryModels) {
      const sayingIds = await CategoryModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);

      if (sayingIds.length > 1) {
        // If the category only have 1 saying then RASA will fail during training
        countOfCategoriesWithData++;
        const categoryName = CategoryModel.property('categoryName');
        const extraTrainingData = CategoryModel.property('extraTrainingData');
        const keywords = await globalService.loadAllByIds({
          ids: await CategoryModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
          model: _constants.MODEL_KEYWORD
        });
        const sayings = await globalService.loadAllByIds({
          ids: await CategoryModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING),
          model: _constants.MODEL_SAYING
        });
        const categoryTrainingData = await categoryService.generateTrainingData({
          keywords,
          sayings,
          extraTrainingData,
          categoryName
        });
        rasaNLUData[_constants.RASA_COMMON_EXAMPLES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_COMMON_EXAMPLES], categoryTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_COMMON_EXAMPLES]]);
        rasaNLUData[_constants.RASA_REGEX_FEATURES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_REGEX_FEATURES], categoryTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_REGEX_FEATURES]]);
        rasaNLUData[_constants.RASA_ENTITY_SYNONYMS] = _lodash.default.flatten([rasaNLUData[_constants.RASA_ENTITY_SYNONYMS], categoryTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_ENTITY_SYNONYMS]]);
      }
    }
  } else {
    const keywords = await globalService.loadAllByIds({
      ids: await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
      model: _constants.MODEL_KEYWORD
    });
    const sayings = await globalService.loadAllByIds({
      ids: await AgentModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING),
      model: _constants.MODEL_SAYING
    });
    const trainingData = await categoryService.generateTrainingData({
      keywords,
      sayings,
      extraTrainingData: AgentModel.property('extraTrainingData'),
      categoryName: 'default'
    });
    rasaNLUData = trainingData[_constants.RASA_NLU_DATA];
    countOfCategoriesWithData = trainingData[_constants.RASA_NLU_DATA][_constants.RASA_COMMON_EXAMPLES].length > 1 ? 1 : 0;
  }

  const allAgentKeywords = await globalService.loadAllByIds({
    ids: await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
    model: _constants.MODEL_KEYWORD
  });
  const modifiersTrainingData = await categoryService.generateTrainingData({
    keywords: allAgentKeywords,
    extraTrainingData: AgentModel.property('extraTrainingData'),
    categoryName: `${AgentModel.property('agentName')}_${_constants.RASA_MODEL_MODIFIERS}`
  });

  if (modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_COMMON_EXAMPLES].length > 1) {
    countOfCategoriesWithData++;
    rasaNLUData[_constants.RASA_COMMON_EXAMPLES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_COMMON_EXAMPLES], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_COMMON_EXAMPLES]]);
    rasaNLUData[_constants.RASA_REGEX_FEATURES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_REGEX_FEATURES], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_REGEX_FEATURES]]);
    rasaNLUData[_constants.RASA_ENTITY_SYNONYMS] = _lodash.default.flatten([rasaNLUData[_constants.RASA_ENTITY_SYNONYMS], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_ENTITY_SYNONYMS]]);
  }

  return {
    rasaNLUData,
    countOfCategoriesWithData
  };
};

module.exports = async function ({
  id,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        categoryService = _ref.categoryService,
        rasaNLUService = _ref.rasaNLUService;

  let model = _guid.default.create().toString();

  try {
    const AgentModel = await redis.factory(_constants.MODEL_AGENT, id);
    const agent = AgentModel.allProperties();
    let markedAsTraining = false; //const rasaStatus = await rasaNLU.Status();

    const CategoryModels = await globalService.loadAllByIds({
      ids: await AgentModel.getAll(_constants.MODEL_CATEGORY, _constants.MODEL_CATEGORY),
      model: _constants.MODEL_CATEGORY,
      returnModel: true
    }); //Train category identifier (If enableModelsPerCategory is false will train a category recognizer between default model and modifiers)

    if (agent.enableModelsPerCategory && CategoryModels.length > 1 || !agent.enableModelsPerCategory && CategoryModels.length > 0) {
      const categoriesTrainingData = await generateTrainingDataForCategoriesRecognizer({
        AgentModel,
        CategoryModels,
        globalService,
        categoryService,
        enableModelsPerCategory: agent.enableModelsPerCategory
      });

      if (categoriesTrainingData.countOfCategoriesWithData > 1) {
        const pipeline = agent.settings[_constants.CONFIG_SETTINGS_CATEGORY_PIPELINE];
        const categoryRecognizerModel = `${agent.agentName}${_constants.RASA_MODEL_CATEGORY_RECOGNIZER}`;
        AgentModel.property('status', _constants.STATUS_TRAINING);
        await AgentModel.saveInstance();
        markedAsTraining = true;
        await rasaNLUService.train({
          project: agent.agentName,
          model: categoryRecognizerModel,
          oldModel: categoryRecognizerModel,
          trainingSet: {
            [_constants.RASA_NLU_DATA]: categoriesTrainingData.rasaNLUData
          },
          pipeline,
          language: agent.language,
          baseURL: agent.settings[_constants.CONFIG_SETTINGS_RASA_URL]
        });
        AgentModel.property('categoryRecognizer', true);
      } else {
        AgentModel.property('categoryRecognizer', false);
      }
    }

    if (agent.enableModelsPerCategory) {
      //const trainingLimit = rasaStatus[RASA_MAX_TRAINING_PROCESSES] - rasaStatus[RASA_CURRENT_TRAINING_PROCESSES];
      const CategoryModelsToTrain = CategoryModels.filter(CategoryModel => {
        const status = CategoryModel.property('status');
        return status === _constants.STATUS_OUT_OF_DATE || status === _constants.STATUS_ERROR;
      }); //Train each category that need it

      if (CategoryModelsToTrain.length > 0) {
        //TODO: Do it in Parallel
        for (let CategoryModel of CategoryModels) {
          const status = CategoryModel.property('status');

          if (status === _constants.STATUS_ERROR || status === _constants.STATUS_OUT_OF_DATE) {
            if (!markedAsTraining) {
              AgentModel.property('status', _constants.STATUS_TRAINING);
              await AgentModel.saveInstance();
              markedAsTraining = true;
            }

            await categoryService.train({
              AgentModel,
              CategoryModel
            });
          }
        }
      }
    } else {
      //Train default model
      const keywords = await globalService.loadAllByIds({
        ids: await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
        model: _constants.MODEL_KEYWORD
      });
      const sayings = await globalService.loadAllByIds({
        ids: await AgentModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING),
        model: _constants.MODEL_SAYING
      });
      const trainingData = await categoryService.generateTrainingData({
        keywords,
        sayings,
        extraTrainingData: agent.extraTrainingData
      });

      if (trainingData.numberOfSayings === 0) {
        return;
      }

      const pipeline = trainingData.numberOfSayings === 1 ? agent.settings[_constants.CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[_constants.CONFIG_SETTINGS_SAYING_PIPELINE];
      model = (trainingData.numberOfSayings === 1 ? _constants.RASA_MODEL_JUST_ER : '') + model;
      model = `${_constants.RASA_MODEL_DEFAULT}${model}`;

      if (!markedAsTraining) {
        AgentModel.property('status', _constants.STATUS_TRAINING);
        await AgentModel.saveInstance();
        markedAsTraining = true;
      }

      await rasaNLUService.train({
        project: agent.agentName,
        model,
        oldModel: agent.model || null,
        trainingSet: {
          [_constants.RASA_NLU_DATA]: trainingData[_constants.RASA_NLU_DATA]
        },
        pipeline,
        language: agent.language,
        baseURL: agent.settings[_constants.CONFIG_SETTINGS_RASA_URL]
      });
    } //train modifiers model


    const rasaNLUData = {
      [_constants.RASA_COMMON_EXAMPLES]: [],
      [_constants.RASA_REGEX_FEATURES]: [],
      [_constants.RASA_ENTITY_SYNONYMS]: []
    };
    const keywords = await globalService.loadAllByIds({
      ids: await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD),
      model: _constants.MODEL_KEYWORD
    });
    const modifiersTrainingData = await categoryService.generateTrainingData({
      keywords,
      extraTrainingData: agent.extraTrainingData
    });
    rasaNLUData[_constants.RASA_COMMON_EXAMPLES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_COMMON_EXAMPLES], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_COMMON_EXAMPLES]]);
    rasaNLUData[_constants.RASA_REGEX_FEATURES] = _lodash.default.flatten([rasaNLUData[_constants.RASA_REGEX_FEATURES], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_REGEX_FEATURES]]);
    rasaNLUData[_constants.RASA_ENTITY_SYNONYMS] = _lodash.default.flatten([rasaNLUData[_constants.RASA_ENTITY_SYNONYMS], modifiersTrainingData[_constants.RASA_NLU_DATA][_constants.RASA_ENTITY_SYNONYMS]]);

    if (modifiersTrainingData.numberOfSayings > 0) {
      const pipeline = modifiersTrainingData.numberOfSayings === 1 ? agent.settings[_constants.CONFIG_SETTINGS_KEYWORD_PIPELINE] : agent.settings[_constants.CONFIG_SETTINGS_SAYING_PIPELINE];
      const modifiersRecognizerModel = `${agent.agentName}_${modifiersTrainingData.numberOfSayings === 1 ? `${_constants.RASA_MODEL_JUST_ER}` : ''}${_constants.RASA_MODEL_MODIFIERS}`;

      if (!markedAsTraining) {
        AgentModel.property('status', _constants.STATUS_TRAINING);
        await AgentModel.saveInstance();
        markedAsTraining = true;
      }

      await rasaNLUService.train({
        project: agent.agentName,
        model: modifiersRecognizerModel,
        oldModel: `${agent.agentName}_${agent.modifiersRecognizerJustER ? `${_constants.RASA_MODEL_JUST_ER}` : ''}${_constants.RASA_MODEL_MODIFIERS}`,
        trainingSet: {
          [_constants.RASA_NLU_DATA]: rasaNLUData
        },
        pipeline,
        language: agent.language,
        baseURL: agent.settings[_constants.CONFIG_SETTINGS_RASA_URL]
      });
      AgentModel.property('modifiersRecognizer', true);
    } else {
      AgentModel.property('modifiersRecognizer', false);
    } //If there is just one modifier set the modifiersRecognizerJustER attribute of the agent with the name of that modifier


    AgentModel.property('modifiersRecognizerJustER', modifiersTrainingData.numberOfSayings === 1 ? rasaNLUData[_constants.RASA_COMMON_EXAMPLES][0].intent : '');
    AgentModel.property('model', model);
    /*
        Only change the status to ready if the status is still training, because if not we are going to mark
        an agent as ready when actually it could be out of date because user edited while it was being trained
    */

    if (markedAsTraining) {
      const CurrentAgentModel = await redis.factory(_constants.MODEL_AGENT, id);
      const currentAgent = CurrentAgentModel.allProperties();

      if (currentAgent.status === _constants.STATUS_TRAINING) {
        AgentModel.property('lastTraining', (0, _moment.default)().utc().format());
        AgentModel.property('status', _constants.STATUS_READY);
      }

      await AgentModel.saveInstance();
      return returnModel ? AgentModel : AgentModel.allProperties();
    }

    return Promise.reject((0, _global.default)({
      agent: agent.agentName
    }));
  } catch (error) {
    const AgentModel = await redis.factory(_constants.MODEL_AGENT, id);
    AgentModel.property('status', _constants.STATUS_ERROR);
    await AgentModel.saveInstance();
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.train.service.js.map