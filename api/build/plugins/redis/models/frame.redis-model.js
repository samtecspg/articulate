"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  action: {
    type: 'string'
  },
  slots: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class FrameRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_FRAME;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = FrameRedisModel;
//# sourceMappingURL=frame.redis-model.js.map