"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.parse-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id = null,
  AgentModel = null
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  const getFirstSayingName = async ({
    CategoryModel
  }) => {
    const categorySayingsIds = await CategoryModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);
    const firstCategorySayingId = categorySayingsIds[0];
    const firstCategorySaying = await globalService.findById({
      id: firstCategorySayingId,
      model: _constants.MODEL_SAYING
    });
    return firstCategorySaying.actions.join(_constants.RASA_INTENT_SPLIT_SYMBOL);
  };

  let formattedCategories = [];

  try {
    AgentModel = AgentModel || (await redis.factory(_constants.MODEL_AGENT, id));
    const agent = AgentModel.allProperties();

    if (!agent.enableModelsPerCategory) {
      if (!agent.lastTraining) {
        return Promise.reject((0, _global.default)({
          message: `The Agent id=[${agent.id}] is not trained`
        }));
      }

      const justER = agent.model.indexOf(_constants.RASA_MODEL_JUST_ER) !== -1;

      if (justER) {
        //Given that the agent only have one saying and is the model is just an ER, then we need the saying name
        const firstAgentCategoryId = await AgentModel.getAll(_constants.MODEL_CATEGORY, _constants.MODEL_CATEGORY);
        const FirstAgentCategoryModel = await globalService.findById({
          id: firstAgentCategoryId,
          model: _constants.MODEL_CATEGORY,
          returnModel: true
        });
        formattedCategories.push({
          name: 'default',
          model: agent.model,
          justER,
          saying: await getFirstSayingName({
            CategoryModel: FirstAgentCategoryModel
          })
        });
      } else {
        formattedCategories.push({
          name: 'default',
          model: agent.model,
          justER
        });
      }
    } else {
      const CategoryModels = await globalService.loadAllLinked({
        parentModel: AgentModel,
        model: _constants.MODEL_CATEGORY,
        returnModel: true
      });

      if (CategoryModels.length === 0) {
        return Promise.reject((0, _global.default)({
          message: `The Agent id=[${agent.id}] doesn't have any categories.`,
          missingCategories: true
        }));
      }

      const TrainedCategoryModels = CategoryModels.filter(CategoryModel => CategoryModel.property('model'));

      if (TrainedCategoryModels.length === 0) {
        return Promise.reject((0, _global.default)({
          message: `The Agent id=[${agent.id}] doesn't have any trained categories.`,
          missingTrainedCategories: true
        }));
      }

      formattedCategories = await Promise.all(TrainedCategoryModels.map(async CategoryModel => {
        const category = CategoryModel.allProperties();
        const justER = category.model.indexOf(_constants.RASA_MODEL_JUST_ER) !== -1;

        if (justER) {
          return [{
            name: category.categoryName,
            model: category.model,
            justER,
            saying: await getFirstSayingName({
              CategoryModel
            })
          }];
        }

        return {
          name: category.categoryName,
          model: category.model,
          justER
        };
      }));
      formattedCategories = _lodash.default.flatten(formattedCategories);
    }

    if (agent.categoryRecognizer) {
      const name = agent.agentName + _constants.RASA_MODEL_CATEGORY_RECOGNIZER;
      formattedCategories.push({
        name,
        model: name
      });
    }

    if (agent.modifiersRecognizer) {
      if (agent.modifiersRecognizerJustER) {
        formattedCategories.push({
          name: `${agent.agentName}_${_constants.RASA_MODEL_MODIFIERS}`,
          model: `${agent.agentName}_${agent.modifiersRecognizerJustER ? `${_constants.RASA_MODEL_JUST_ER}` : ''}${_constants.RASA_MODEL_MODIFIERS}`,
          justER: true,
          saying: agent.modifiersRecognizerJustER
        });
      } else {
        formattedCategories.push({
          name: `${agent.agentName}_${_constants.RASA_MODEL_MODIFIERS}`,
          model: `${agent.agentName}_${_constants.RASA_MODEL_MODIFIERS}`
        });
      }
    }

    return formattedCategories;
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.get-trained-categories.service.js.map