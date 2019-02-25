"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  agentName: {
    type: 'string',
    unique: true,
    index: true,
    defaultSort: true
  },
  description: {
    type: 'string',
    index: true
  },
  language: {
    type: 'string'
  },
  timezone: {
    type: 'string'
  },
  useWebhook: {
    type: 'boolean'
  },
  usePostFormat: {
    type: 'boolean'
  },
  multiCategory: {
    type: 'boolean'
  },
  categoryClassifierThreshold: {
    type: 'float'
  },
  fallbackAction: {
    type: 'string'
  },
  status: {
    type: 'string'
  },
  lastTraining: {
    type: 'string'
  },
  extraTrainingData: {
    type: 'boolean'
  },
  enableModelsPerCategory: {
    type: 'boolean'
  },
  model: {
    type: 'string'
  },
  parameters: {
    type: 'json'
  },
  settings: {
    type: 'json'
  },
  categoryRecognizer: {
    type: 'boolean',
    defaultValue: false
  },
  modifiersRecognizer: {
    type: 'boolean',
    defaultValue: false
  },
  modifiersRecognizerJustER: {
    type: 'string',
    defaultValue: ''
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class AgentRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
    this.publish = true;
  }

  static get modelName() {
    return _constants.MODEL_AGENT;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = AgentRedisModel;
//# sourceMappingURL=agent.redis-model.js.map