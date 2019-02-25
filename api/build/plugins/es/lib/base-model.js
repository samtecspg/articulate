"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class BaseModel {
  constructor({
    name,
    properties,
    client
  }) {
    this.name = name;
    this.index = _lodash.default.snakeCase(name);
    this.properties = properties;
    this.client = client;
  }

  async count({
    query = null
  } = {}) {
    const index = this.index;
    const body = query ? {
      query
    } : undefined;

    const _ref = await this.client.count({
      index,
      body
    }),
          count = _ref.count;

    return count;
  }

  async createInstance({
    data,
    refresh = true
  }) {
    const index = this.index;
    return await this.client.index({
      index,
      type: index,
      body: data,
      refresh
    });
  }

  async updateInstance({
    id,
    data,
    refresh = true
  }) {
    const index = this.index;
    return await this.client.index({
      index,
      type: index,
      id,
      body: data,
      refresh
    });
  }

  async removeInstance({
    id,
    refresh = true
  }) {
    const index = this.index;
    await this.client.delete({
      index,
      type: index,
      id,
      refresh
    });
  }

  async findById({
    id,
    refresh = true,
    source = true
  }) {
    const index = this.index;
    return await this.client.get({
      index,
      type: index,
      id,
      refresh,
      _source: source
    });
  }

  async search({
    body
  }) {
    const index = this.index;
    return await this.client.search({
      index,
      body
    });
  }

};
//# sourceMappingURL=base-model.js.map