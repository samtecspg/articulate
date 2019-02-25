"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.invalid-keywords-from-agent"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const filterById = ({
  models,
  ids
}) => _lodash.default.filter(models, model => _lodash.default.includes(ids, model.id));

module.exports = async function ({
  data,
  actionId,
  AgentModel = null,
  returnModel = false
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        keywordService = _ref.keywordService;

  try {
    const ActionModel = await redis.factory(_constants.MODEL_ACTION, actionId); // Create lists of keywords to be used later

    const agentKeywordIds = await AgentModel.getAll(_constants.MODEL_KEYWORD, _constants.MODEL_KEYWORD);
    const keywordIds = keywordService.splitAddedOldRemovedIds({
      oldKeywords: ActionModel.isLoaded ? (0, _lodash.default)(ActionModel.property('slots')) : [],
      newKeywords: data.keywords
    }); // Validate if the new keywords belongs to the current Agent

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
    const removedKeywordModels = filterById({
      models: FilteredKeywordModels,
      ids: keywordIds.removed
    });
    const parentModels = [AgentModel, ...newKeywordModelsNonSystem];

    if (ActionModel.isLoaded) {
      //Update
      if (data.actionName !== undefined && ActionModel.property('actionName') !== data.actionName) {
        AgentModel.property('status', _constants.STATUS_OUT_OF_DATE);
      }

      await AgentModel.saveInstance();
      await ActionModel.updateInstance({
        data,
        parentModels,
        removedParents: removedKeywordModels
      });
    } else {
      // Create
      await ActionModel.createInstance({
        data,
        parentModels
      });
    }

    return returnModel ? ActionModel : ActionModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=action.upsert.service.js.map