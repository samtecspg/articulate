"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _agentConverseFulfillEmptySlotsWithSavedValues = _interopRequireDefault(require("./agent/agent-converse-fulfill-empty-slots-with-saved-values.service"));

var _agentConverseCallWebhook = _interopRequireDefault(require("./agent/agent.converse-call-webhook.service"));

var _agentConverseCompileResponseTemplates = _interopRequireDefault(require("./agent/agent.converse-compile-response-templates.service"));

var _agentConverseGenerateResponseFallback = _interopRequireDefault(require("./agent/agent.converse-generate-response-fallback.service"));

var _agentConverseGenerateResponse = _interopRequireDefault(require("./agent/agent.converse-generate-response.service"));

var _agentConverseUpdateContextFrames = _interopRequireDefault(require("./agent/agent.converse-update-context-frames.service"));

var _agentConverse = _interopRequireDefault(require("./agent/agent.converse.service"));

var _agentCreateAction = _interopRequireDefault(require("./agent/agent.create-action.service"));

var _agentCreateCategory = _interopRequireDefault(require("./agent/agent.create-category.service"));

var _agentCreateKeyword = _interopRequireDefault(require("./agent/agent.create-keyword.service"));

var _agentCreatePostFormat = _interopRequireDefault(require("./agent/agent.create-post-format.service"));

var _agentCreateWebhook = _interopRequireDefault(require("./agent/agent.create-webhook.service"));

var _agentCreate = _interopRequireDefault(require("./agent/agent.create.service"));

var _agentExport = _interopRequireDefault(require("./agent/agent.export.service"));

var _agentFindAllDocuments = _interopRequireDefault(require("./agent/agent.find-all-documents.service"));

var _agentFindAllSayings = _interopRequireDefault(require("./agent/agent.find-all-sayings.service"));

var _agentFindAllSettings = _interopRequireDefault(require("./agent/agent.find-all-settings.service"));

var _agentFindSettingByName = _interopRequireDefault(require("./agent/agent.find-setting-by-name.service"));

var _agentGetTrainedCategories = _interopRequireDefault(require("./agent/agent.get-trained-categories.service"));

var _agentImport = _interopRequireDefault(require("./agent/agent.import.service"));

var _agentIsModelUnique = _interopRequireDefault(require("./agent/agent.is-model-unique.service"));

var _agentParseDucklingKeywords = _interopRequireDefault(require("./agent/agent.parse-duckling-keywords.service"));

var _agentParseRasaKeywords = _interopRequireDefault(require("./agent/agent.parse-rasa-keywords.service"));

var _agentParseRegexKeywords = _interopRequireDefault(require("./agent/agent.parse-regex-keywords.service"));

var _agentParse = _interopRequireDefault(require("./agent/agent.parse.service"));

var _agentRemoveAction = _interopRequireDefault(require("./agent/agent.remove-action.service"));

var _agentRemoveCategory = _interopRequireDefault(require("./agent/agent.remove-category.service"));

var _agentRemoveKeyword = _interopRequireDefault(require("./agent/agent.remove-keyword.service"));

var _agentRemovePostFormatInAction = _interopRequireDefault(require("./agent/agent.remove-post-format-in-action.service"));

var _agentRemovePostFormat = _interopRequireDefault(require("./agent/agent.remove-post-format.service"));

var _agentRemoveSayingInCategory = _interopRequireDefault(require("./agent/agent.remove-saying-in-category.service"));

var _agentRemoveWebhookInAction = _interopRequireDefault(require("./agent/agent.remove-webhook-in-action.service"));

var _agentRemoveWebhook = _interopRequireDefault(require("./agent/agent.remove-webhook.service"));

var _agentRemove = _interopRequireDefault(require("./agent/agent.remove.service"));

var _agentTrainCategory = _interopRequireDefault(require("./agent/agent.train-category.service"));

var _agentTrain = _interopRequireDefault(require("./agent/agent.train.service"));

var _agentUpdateAction = _interopRequireDefault(require("./agent/agent.update-action.service"));

var _agentUpdateAllSettings = _interopRequireDefault(require("./agent/agent.update-all-settings.service"));

var _agentUpdateById = _interopRequireDefault(require("./agent/agent.update-by-id.service"));

var _agentUpdateCategory = _interopRequireDefault(require("./agent/agent.update-category.service"));

var _agentUpdateKeyword = _interopRequireDefault(require("./agent/agent.update-keyword.service"));

var _agentUpdatePostFormat = _interopRequireDefault(require("./agent/agent.update-post-format.service"));

var _agentUpdateWebhook = _interopRequireDefault(require("./agent/agent.update-webhook.service"));

var _agentUpsertPostFormatInAction = _interopRequireDefault(require("./agent/agent.upsert-post-format-in-action.service"));

var _agentUpsertSayingInCategory = _interopRequireDefault(require("./agent/agent.upsert-saying-in-category.service"));

var _agentUpsertWebhookInAction = _interopRequireDefault(require("./agent/agent.upsert-webhook-in-action.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable prefer-arrow-callback */
module.exports = class AgentService extends _schmervice.default.Service {
  async create() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreate.default,
      name: 'AgentService.create'
    }).apply(this, arguments);
  }

  async remove() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemove.default,
      name: 'AgentService.remove'
    }).apply(this, arguments);
  }

  async createCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreateCategory.default,
      name: 'AgentService.createCategory'
    }).apply(this, arguments);
  }

  async createAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreateAction.default,
      name: 'AgentService.createAction'
    }).apply(this, arguments);
  }

  async updateAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateAction.default,
      name: 'AgentService.updateAction'
    }).apply(this, arguments);
  }

  async createKeyword() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreateKeyword.default,
      name: 'AgentService.createKeyword'
    }).apply(this, arguments);
  }

  async createPostFormat() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreatePostFormat.default,
      name: 'AgentService.createPostFormat'
    }).apply(this, arguments);
  }

  async upsertPostFormatInAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpsertPostFormatInAction.default,
      name: 'AgentService.upsertPostFormatInAction'
    }).apply(this, arguments);
  }

  async updateById() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateById.default,
      name: 'AgentService.updateById'
    }).apply(this, arguments);
  }

  async removePostFormat() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemovePostFormat.default,
      name: 'AgentService.removePostFormat'
    }).apply(this, arguments);
  }

  async removeWebhook() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveWebhook.default,
      name: 'AgentService.removeWebhook'
    }).apply(this, arguments);
  }

  async updatePostFormat() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdatePostFormat.default,
      name: 'AgentService.updatePostFormat'
    }).apply(this, arguments);
  }

  async createWebhook() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentCreateWebhook.default,
      name: 'AgentService.createWebhook'
    }).apply(this, arguments);
  }

  async findAllSayings() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentFindAllSayings.default,
      name: 'AgentService.findAllSayings'
    }).apply(this, arguments);
  }

  async findAllSettings() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentFindAllSettings.default,
      name: 'AgentService.findAllSettings'
    }).apply(this, arguments);
  }

  async findSettingByName() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentFindSettingByName.default,
      name: 'AgentService.findSettingByName'
    }).apply(this, arguments);
  }

  async updateAllSettings() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateAllSettings.default,
      name: 'AgentService.updateAllSettings'
    }).apply(this, arguments);
  }

  async upsertSayingInCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpsertSayingInCategory.default,
      name: 'AgentService.upsertSayingInCategory'
    }).apply(this, arguments);
  }

  async updateKeyword() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateKeyword.default,
      name: 'AgentService.updateKeyword'
    }).apply(this, arguments);
  }

  async updateCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateCategory.default,
      name: 'AgentService.updateCategory'
    }).apply(this, arguments);
  }

  async upsertWebhookInAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpsertWebhookInAction.default,
      name: 'AgentService.upsertWebhookInAction'
    }).apply(this, arguments);
  }

  async removeWebhookInAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveWebhookInAction.default,
      name: 'AgentService.removeWebhookInAction'
    }).apply(this, arguments);
  }

  async removePostFormatInAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemovePostFormatInAction.default,
      name: 'AgentService.removePostFormatInAction'
    }).apply(this, arguments);
  }

  async removeAction() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveAction.default,
      name: 'AgentService.removeAction'
    }).apply(this, arguments);
  }

  async removeSayingInCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveSayingInCategory.default,
      name: 'AgentService.removeSayingInCategory'
    }).apply(this, arguments);
  }

  async removeCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveCategory.default,
      name: 'AgentService.removeCategory'
    }).apply(this, arguments);
  }

  async removeKeyword() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentRemoveKeyword.default,
      name: 'AgentService.removeKeyword'
    }).apply(this, arguments);
  }

  async export() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentExport.default,
      name: 'AgentService.export'
    }).apply(this, arguments);
  }

  async import() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentImport.default,
      name: 'AgentService.import'
    }).apply(this, arguments);
  }

  async trainCategory() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentTrainCategory.default,
      name: 'AgentService.trainCategory'
    }).apply(this, arguments);
  }

  async train() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentTrain.default,
      name: 'AgentService.train'
    }).apply(this, arguments);
  }

  async parse() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentParse.default,
      name: 'AgentService.parse'
    }).apply(this, arguments);
  }

  async parseRegexKeywords() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentParseRegexKeywords.default,
      name: 'AgentService.parseRegexKeywords'
    }).apply(this, arguments);
  }

  async parseDucklingKeywords() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentParseDucklingKeywords.default,
      name: 'AgentService.parseDucklingKeywords'
    }).apply(this, arguments);
  }

  async parseRasaKeywords() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentParseRasaKeywords.default,
      name: 'AgentService.parseRasaKeywords'
    }).apply(this, arguments);
  }

  async getTrainedCategories() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentGetTrainedCategories.default,
      name: 'AgentService.getTrainedCategories'
    }).apply(this, arguments);
  }

  async updateWebhook() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentUpdateWebhook.default,
      name: 'AgentService.updateWebhook'
    }).apply(this, arguments);
  }

  async converse() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverse.default,
      name: 'AgentService.converse'
    }).apply(this, arguments);
  }

  async converseGenerateResponseFallback() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseGenerateResponseFallback.default,
      name: 'AgentService.converseGenerateResponseFallback'
    }).apply(this, arguments);
  }

  async converseGenerateResponse() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseGenerateResponse.default,
      name: 'AgentService.converseGenerateResponse'
    }).apply(this, arguments);
  }

  async converseUpdateContextFrames() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseUpdateContextFrames.default,
      name: 'AgentService.converseUpdateContextFrames'
    }).apply(this, arguments);
  }

  async converseCompileResponseTemplates() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseCompileResponseTemplates.default,
      name: 'AgentService.converseCompileResponseTemplates'
    }).apply(this, arguments);
  }

  async converseCallWebhook() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseCallWebhook.default,
      name: 'AgentService.converseCallWebhook'
    }).apply(this, arguments);
  }

  async converseFulfillEmptySlotsWithSavedValues() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentConverseFulfillEmptySlotsWithSavedValues.default,
      name: 'AgentService.converseFulfillEmptySlotsWithSavedValues'
    }).apply(this, arguments);
  }

  async isModelUnique() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentIsModelUnique.default,
      name: 'AgentService.isModelUnique'
    }).apply(this, arguments);
  }

  async findAllDocuments() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _agentFindAllDocuments.default,
      name: 'AgentService.findAllDocuments'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=agent.services.js.map