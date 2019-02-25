"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AgentModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      agentName: _joi.default.string().trim(),
      description: _joi.default.string().trim(),
      language: _joi.default.string().trim(),
      timezone: _joi.default.string().trim(),
      useWebhook: _joi.default.boolean(),
      usePostFormat: _joi.default.boolean(),
      multiCategory: _joi.default.boolean(),
      categoryClassifierThreshold: _joi.default.number(),
      fallbackAction: _joi.default.string().trim(),
      status: _joi.default.string().trim(),
      lastTraining: _joi.default.alternatives().try(_joi.default.date(), _joi.default.string().trim().allow('')),
      extraTrainingData: _joi.default.boolean(),
      enableModelsPerCategory: _joi.default.boolean(),
      model: _joi.default.string().allow(''),
      categoryRecognizer: _joi.default.boolean(),
      modifiersRecognizer: _joi.default.boolean(),
      modifiersRecognizerJustER: _joi.default.string().allow(''),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string(),
      parameters: _joi.default.object()
    };
  }

}

module.exports = AgentModel;
//# sourceMappingURL=agent.model.js.map