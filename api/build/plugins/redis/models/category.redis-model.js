"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  categoryName: {
    type: 'string',
    index: true,
    defaultSort: true
  },
  enabled: {
    type: 'boolean'
  },
  actionThreshold: {
    type: 'float'
  },
  status: {
    type: 'string'
  },
  lastTraining: {
    type: 'string'
  },
  model: {
    type: 'string'
  },
  extraTrainingData: {
    type: 'boolean'
  },
  parameters: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class CategoryRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_CATEGORY;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = CategoryRedisModel;
//# sourceMappingURL=category.redis-model.js.map