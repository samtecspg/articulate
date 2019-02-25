"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

module.exports = async function ({
  payload
}) {
  const _ref = await this.server.services(),
        agentService = _ref.agentService;

  const actions = payload.actions,
        categories = payload.categories,
        keywords = payload.keywords,
        settings = payload.settings,
        agentPostFormat = payload.postFormat,
        agentWebhook = payload.webhook,
        agent = _objectWithoutProperties(payload, ["actions", "categories", "keywords", "settings", "postFormat", "webhook"]);

  const keywordsDir = {};

  try {
    const AgentModel = await agentService.create({
      data: _objectSpread({}, agent, {
        status: _constants.STATUS_OUT_OF_DATE,
        enableModelsPerCategory: _lodash.default.defaultTo(agent.enableModelsPerCategory, true),
        multiCategory: _lodash.default.defaultTo(agent.multiCategory, true),
        extraTrainingData: _lodash.default.defaultTo(agent.extraTrainingData, true)
      }),
      isImport: true,
      returnModel: true
    });

    if (settings) {
      await agentService.updateAllSettings({
        AgentModel,
        settingsData: settings
      });
    }

    if (agent.usePostFormat) {
      await agentService.createPostFormat({
        AgentModel,
        postFormatData: agentPostFormat
      });
    }

    if (agent.useWebhook) {
      await agentService.createWebhook({
        AgentModel,
        webhookData: agentWebhook
      });
    }

    await Promise.all(keywords.map(async keyword => {
      const newKeyword = await agentService.createKeyword({
        AgentModel,
        keywordData: keyword
      });
      keywordsDir[newKeyword.keywordName] = parseInt(newKeyword.id);
    }));
    await Promise.all(categories.map(async category => {
      const sayings = category.sayings,
            categoryData = _objectWithoutProperties(category, ["sayings"]);

      if (categoryData.model) {
        delete categoryData.model;
      }

      const CategoryModel = await agentService.createCategory({
        AgentModel,
        categoryData,
        returnModel: true
      });
      return await Promise.all(sayings.map(async saying => {
        saying.keywords.forEach(tempKeyword => {
          tempKeyword.keywordId = keywordsDir[tempKeyword.keyword];
        });
        return await agentService.upsertSayingInCategory({
          id: AgentModel.id,
          categoryId: CategoryModel.id,
          sayingData: saying
        });
      }));
    }));
    await Promise.all(actions.map(async action => {
      const postFormat = action.postFormat,
            webhook = action.webhook,
            actionData = _objectWithoutProperties(action, ["postFormat", "webhook"]);

      const ActionModel = await agentService.createAction({
        AgentModel,
        actionData
      });

      if (action.usePostFormat) {
        await agentService.upsertPostFormatInAction({
          id: AgentModel.id,
          actionId: ActionModel.id,
          postFormatData: postFormat
        });
      }

      if (action.useWebhook) {
        await agentService.upsertWebhookInAction({
          id: AgentModel.id,
          actionId: ActionModel.id,
          data: webhook
        });
      }
    }));
    return await agentService.export({
      id: AgentModel.id
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.import.service.js.map