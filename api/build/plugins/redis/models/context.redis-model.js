"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  sessionId: {
    type: 'string',
    unique: true,
    index: true,
    defaultSort: true
  },
  savedSlots: {
    type: 'json'
  },
  actionQueue: {
    type: 'json'
  },
  responseQueue: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class ContextRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_CONTEXT;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

  async findBySessionId({
    sessionId
  }) {
    return await this.searchByField({
      field: 'sessionId',
      value: sessionId
    });
  }

}

module.exports = ContextRedisModel;
//# sourceMappingURL=context.redis-model.js.map