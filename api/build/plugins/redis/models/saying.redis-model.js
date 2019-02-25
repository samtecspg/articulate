"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  userSays: {
    type: 'string'
  },
  keywords: {
    type: 'json'
  },
  actions: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class SayingRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_SAYING;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = SayingRedisModel;
//# sourceMappingURL=saying.redis-model.js.map