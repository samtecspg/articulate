"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data,
  isImport = false,
  returnModel = false
}) {
  const defaultFallbackAction = {
    useWebhook: false,
    usePostFormat: false,
    responses: [],
    slots: []
  };
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        settingsService = _ref.settingsService,
        agentService = _ref.agentService;

  data.status = isImport ? _constants.STATUS_OUT_OF_DATE : data.status || _constants.STATUS_READY;
  data.settings = {};

  if (data.enableModelsPerCategory === undefined) {
    data.enableModelsPerCategory = true;
  }

  const AgentModel = await redis.factory(_constants.MODEL_AGENT);

  try {
    const allSettings = await settingsService.findAll();
    defaultFallbackAction.actionName = allSettings[_constants.CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];

    _lodash.default.each(allSettings[_constants.CONFIG_SETTINGS_RESPONSES_AGENT_DEFAULT], fallbackResponse => {
      defaultFallbackAction.responses.push({
        textResponse: fallbackResponse,
        actions: []
      });
    });

    _lodash.default.each(_constants.CONFIG_SETTINGS_DEFAULT_AGENT, value => {
      data.settings[value] = allSettings[value];
    });

    data.fallbackAction = isImport ? data.fallbackAction : allSettings[_constants.CONFIG_SETTINGS_DEFAULT_FALLBACK_ACTION_NAME];

    if (isImport && data.model) {
      delete data.model;
    }

    await AgentModel.createInstance({
      data
    });

    if (!isImport) {
      await agentService.createAction({
        AgentModel,
        actionData: defaultFallbackAction
      });
    }

    return returnModel ? AgentModel : AgentModel.allProperties();
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.create.service.js.map