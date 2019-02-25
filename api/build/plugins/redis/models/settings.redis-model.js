"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  name: {
    type: 'string',
    unique: true,
    index: true,
    defaultSort: true
  },
  value: {
    type: 'json'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class SettingsRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_SETTINGS;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

  async findAll() {
    const ids = await this.find();
    return await this.findAllByIds({
      ids
    });
  }

  async findByName({
    name
  }) {
    return await this.searchByField({
      field: 'name',
      value: name
    });
  }

}

module.exports = SettingsRedisModel;
//# sourceMappingURL=settings.redis-model.js.map