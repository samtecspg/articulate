"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  keywordName: {
    type: 'string',
    index: true,
    defaultSort: true
  },
  uiColor: {
    type: 'string'
  },
  examples: {
    type: 'json'
  },
  regex: {
    type: 'string'
  },
  type: {
    type: 'string'
  },
  modifiers: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class KeywordRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_KEYWORD;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = KeywordRedisModel;
//# sourceMappingURL=keyword.redis-model.js.map