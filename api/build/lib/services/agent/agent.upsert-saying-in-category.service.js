"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.invalid-keywords-from-agent"));

var _global2 = _interopRequireDefault(require("../../errors/global.invalid-actions-from-agent"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `service:agent:update-saying-in-category` });
const filterById = ({
  models,
  ids
}) => {
  return _lodash.default.filter(models, model => {
    return _lodash.default.includes(ids, model.id);
  });
};

module.exports = async function ({
  id,
  categoryId,
  sayingId = null,
  sayingData,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        categoryService = _ref.categoryService,
        keywordService = _ref.keywordService,
        actionService = _ref.actionService;

  try {
    const modelPath = [_constants.MODEL_AGENT, _constants.MODEL_CATEGORY];
    const modelPathIds = [id, categoryId, sayingId];

    if (sayingId) {
      modelPath.push(_constants.MODEL_SAYING);
      modelPathIds.push(sayingId);
    } // Load Used Models


    const models = await globalService.getAllModelsInPath({
      modelPath,
      ids: modelPathIds,
      returnModel: true
    });
    const AgentModel = models[_constants.MODEL_AGENT];
    const CategoryModel = models[_constants.MODEL_CATEGORY];
    const SayingModel = models[_constants.MODEL_SAYING] || (await redis.factory(_constants.MODEL_SAYING)); //Empty model if we are going to do a create

    sayingData.keywords = _lodash.default.sortBy(sayingData.keywords, keyword => keyword.start); // Create lists of keywords and actions to be used later

    let agentKeywordIds = await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD);
    let agentActionIds = await AgentModel.getAll(_constants.MODEL_ACTION, _constants.MODEL_ACTION);
    agentKeywordIds = agentKeywordIds.map(agentKeywordId => parseInt(agentKeywordId));
    agentActionIds = agentActionIds.map(agentActionId => agentActionId);
    const keywordIds = keywordService.splitAddedOldRemovedIds({
      oldKeywords: SayingModel.isLoaded ? (0, _lodash.default)(SayingModel.property('keywords')) : [],
      newKeywords: sayingData.keywords
    });
    const AgentActionsModels = await globalService.loadAllByIds({
      ids: agentActionIds,
      model: _constants.MODEL_ACTION,
      returnModel: true
    });
    const actionIds = actionService.splitAddedOldRemovedIds({
      oldActions: SayingModel.isLoaded ? SayingModel.property('actions') : [],
      newActions: sayingData.actions,
      AgentActionsModels
    });

    const notValidActionIds = _lodash.default.difference(actionIds.added, agentActionIds);

    if (notValidActionIds.length > 0) {
      return Promise.reject((0, _global2.default)({
        actionIds: notValidActionIds,
        agentId: AgentModel.id
      }));
    } // Validate if the new keywords belongs to the current Agent


    const notValidIds = _lodash.default.difference(keywordIds.addedNonSystem, agentKeywordIds);

    if (notValidIds.length > 0) {
      return Promise.reject((0, _global.default)({
        keywordIds: notValidIds,
        agentId: AgentModel.id
      }));
    }

    const FilteredKeywordModels = await globalService.loadAllByIds({
      ids: [...keywordIds.added, ...keywordIds.removed],
      //Only load the keywords we are going to use
      model: _constants.MODEL_KEYWORD,
      returnModel: true
    });
    const newKeywordModelsNonSystem = filterById({
      models: FilteredKeywordModels,
      ids: keywordIds.addedNonSystem
    });
    const newKeywordModels = filterById({
      models: FilteredKeywordModels,
      ids: keywordIds.added
    });
    const removedKeywordModels = filterById({
      models: FilteredKeywordModels,
      ids: keywordIds.removed
    });
    const newActionModels = filterById({
      models: AgentActionsModels,
      ids: actionIds.added
    });
    const removedActionModels = filterById({
      models: AgentActionsModels,
      ids: actionIds.removed
    });
    const parentModels = [AgentModel, CategoryModel, ...newKeywordModelsNonSystem, ...newActionModels];

    if (SayingModel.isLoaded) {
      //Update
      // ADD Parent ---> Saying
      await SayingModel.updateInstance({
        data: sayingData,
        parentModels,
        removedParents: removedKeywordModels.concat(removedActionModels)
      }); // ADD Category <---> UsedKeywords

      await categoryService.linkKeywords({
        model: CategoryModel,
        keywordModels: newKeywordModels
      }); // REMOVE Category <-/-> UnusedKeyword

      await categoryService.unlinkKeywords({
        model: CategoryModel,
        keywordModels: removedKeywordModels
      });
    } else {
      // Create
      SayingModel.link(CategoryModel, _constants.MODEL_CATEGORY); // ADD Parent ---> Saying

      await SayingModel.createInstance({
        data: sayingData,
        parentModels
      }); // ADD Category <---> NewKeyword

      await categoryService.linkKeywords({
        model: CategoryModel,
        keywordModels: newKeywordModels
      });
    } // Update status


    AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
    CategoryModel.property('status', _constants.STATUS_OUT_OF_DATE);
    await AgentModel.saveInstance();
    await CategoryModel.saveInstance();
    return returnModel ? SayingModel : SayingModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.upsert-saying-in-category.service.js.map