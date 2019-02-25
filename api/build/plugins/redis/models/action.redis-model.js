"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  actionName: {
    type: 'string',
    index: true
  },
  slots: {
    type: 'json'
  },
  responses: {
    type: 'json'
  },
  useWebhook: {
    type: 'boolean'
  },
  usePostFormat: {
    type: 'boolean'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class ActionRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_ACTION;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = ActionRedisModel;
//# sourceMappingURL=action.redis-model.js.map