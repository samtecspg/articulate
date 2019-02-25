"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _nohm = require("nohm");

var Constants = _interopRequireWildcard(require("../../../util/constants"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../util/logger')({ name: `plugin:redis:base-model` });
const defaults = {
  SKIP: 0,
  LIMIT: 50,
  DIRECTION: Constants.SORT_ASC
};

const getLimit = ({
  skip,
  limit,
  length = undefined
}) => {
  let parsedLimit = null;

  if (!limit) {
    parsedLimit = null;
  } else if (skip === undefined) {
    parsedLimit = [limit, length];
  } else {
    parsedLimit = [skip, limit];
  }

  return parsedLimit;
};

const filterResults = ({
  results,
  filter
}) => {
  if (_lodash.default.isEmpty(filter)) {
    return results;
  }

  const match = [];

  _lodash.default.each(filter, (value, attributeName) => {
    _lodash.default.each(results, result => {
      if (_lodash.default.includes(match, result)) {
        //Already matched this value
        return;
      }

      const properties = result.allProperties();
      const property = properties[attributeName];

      if (property === null) {
        //valid attribute but with null value
        return;
      }

      if (property === undefined) {
        //invalid attribute
        return match.push(result);
      }

      if (_lodash.default.isArray(property)) {
        const arrayValue = _lodash.default.isArray(value) ? value : [value];

        const intersection = _lodash.default.intersection(arrayValue, property);

        if (intersection.length > 0) {
          return match.push(result);
        }
      }

      if (_lodash.default.isString(property)) {
        if (property.toLowerCase().search(value.toLowerCase()) >= 0) {
          return match.push(result);
        }
      } else if (property === value) {
        return match.push(result);
      }
    });
  });

  return match;
};

const manualPaging = ({
  results,
  skip,
  limit,
  direction,
  field
}) => {
  let sorted = _lodash.default.sortBy(results, [o => {
    const value = field === 'id' ? _lodash.default.toNumber(o.id) : _lodash.default.toNumber(o.property(field));
    return isNaN(value) ? o.property(field) : value;
  }]);

  sorted = direction === Constants.SORT_ASC ? sorted : sorted.reverse();
  sorted = sorted.slice(skip, limit === -1 ? sorted.length : skip + limit);
  return sorted;
};

module.exports = class BaseModel extends _nohm.NohmModel {
  constructor({
    schema
  }) {
    super();
    this.schema = schema;
  }

  defaultSortField() {
    let field = null;

    _lodash.default.each(this.schema, (current, key) => {
      field = current.defaultSort ? key : field;
    });

    return _lodash.default.isNil(field) ? 'id' : field;
  }

  //using create() or update() conflicts with functions from NohmModel
  async createInstance({
    data,
    parentModels,
    modified
  }) {
    if (!modified) {
      data.creationDate = (0, _moment.default)().utc().format();
      data.modificationDate = (0, _moment.default)().utc().format();
    }

    await this.property(data);
    await this.save();
    await this.linkParents({
      parentModels
    });
    return this.allProperties();
  }

  async updateInstance({
    id = null,
    data,
    parentModels,
    removedParents
  }) {
    if (id) {
      // loads the model, if there is no id assumes that was already loaded
      await this.findById({
        id
      });
    }

    data.modificationDate = (0, _moment.default)().utc().format();
    await this.createInstance({
      data,
      modified: true
    });
    await this.linkParents({
      parentModels
    });
    await this.unlinkParents({
      parentModels: removedParents
    });
  }

  async saveInstance() {
    this.property('modificationDate', (0, _moment.default)().utc().format());
    await this.save();
  }

  async findById({
    id
  }) {
    return await this.load(id);
  }

  async findAll({
    skip = defaults.SKIP,
    limit = defaults.LIMIT,
    direction = defaults.DIRECTION,
    field,
    filter = null
  }) {
    const ids = await this.find();
    field = field ? field : this.defaultSortField();

    if (filter) {
      const results = await this.loadAllByIds({
        ids
      });
      const filteredResults = filterResults({
        results,
        filter
      });
      return manualPaging({
        results: filteredResults,
        skip,
        limit,
        direction,
        field
      });
    }

    return await this.findAllByIds({
      ids,
      skip,
      limit,
      direction,
      field
    });
  }

  async count() {
    const ids = await this.find();
    return ids.length;
  }

  async findAllByIds({
    ids,
    skip = defaults.SKIP,
    limit = defaults.LIMIT,
    direction = defaults.DIRECTION,
    field,
    filter,
    include
  }) {
    if (!_lodash.default.isArray(ids) || ids.leading === 0) {
      return [];
    }

    field = field ? field : this.defaultSortField();

    if (include || filter) {
      const results = await this.loadAllByIds({
        ids
      });
      /* if (include.length > 0) {
           await this.include({ include, results });
       }*/

      const filteredResults = await filterResults({
        results,
        filter
      });
      return await manualPaging({
        results: filteredResults,
        skip,
        limit,
        direction,
        field
      });
    }

    if (field) {
      if (field === 'id') {
        if (direction === Constants.SORT_DESC) {
          ids = ids.reverse();
        }

        if (limit === -1) {
          ids = ids.slice(skip);
        } else {
          ids = ids.slice(skip, skip + limit);
        }
      } else {
        limit = getLimit({
          skip,
          limit,
          length: ids.length
        });
        ids = await this.sort({
          field,
          direction,
          limit
        }, ids);
      }
    } else {
      if (limit === -1) {
        ids = ids.slice(skip, ids.length);
      } else {
        ids = ids.slice(skip, skip + limit);
      }
    }

    if (ids.length === 0) {
      return [];
    }

    return await this.loadAllByIds({
      ids
    });
  }

  async loadAllByIds({
    ids
  }) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return [];
    }

    const loadPromises = ids.map(async id => {
      try {
        return await this.nohmClass.factory(this.modelName, id);
      } catch (err) {
        if (!(err && err.message === 'not found')) {
          throw err;
        }
      }
    });
    const loadedModels = await Promise.all(loadPromises);
    return loadedModels.filter(model => typeof model !== 'undefined');
  }

  async removeInstance({
    id = null,
    silent = false
  } = {}) {
    if (id) {
      await this.findById({
        id
      });
    }

    await this.remove(silent);
    return true;
  }

  async searchByField({
    field,
    value
  }) {
    const schemaField = this.schema[field];

    if (!schemaField) {
      throw Error(Constants.ERROR_FIELD_NOT_FOUND);
    }

    const ids = await this.find({
      [field]: value
    });

    if (ids.length > 0) {
      if (schemaField.unique) {
        return await this.findById({
          id: ids[0]
        });
      }

      return await this.findAllByIds({
        ids
      });
    }

    return [];
  }

  async linkParents({
    parentModels = [],
    linkName = null
  }) {
    if (parentModels.length > 0) {
      const linkPromises = parentModels.map(async parentModel => {
        await parentModel.link(this, linkName || this.modelName);
        await parentModel.save();
      });
      await Promise.all(linkPromises);
    }
  }

  async unlinkParents({
    parentModels = [],
    linkName = null
  }) {
    if (parentModels.length > 0) {
      const linkPromises = parentModels.map(async parentModel => {
        const belongs = await parentModel.belongsTo(this, linkName || this.modelName);

        if (!belongs) {
          return;
        }

        await parentModel.unlink(this, linkName || this.modelName);
        await parentModel.save();
      });
      await Promise.all(linkPromises);
    }
  }

  export() {
    const properties = this.allProperties();
    delete properties.id;
    return properties;
  }

  async include({
    include,
    results
  }) {
    const resultPromises = results.map(async result => {
      const includePromises = await include.map(async inc => {
        const relatedModelsIds = await result.getAll(inc, inc);
        const relatedModel = await this.nohmClass.factory(inc);
        const relatedModels = await relatedModel.loadAllByIds({
          ids: relatedModelsIds
        }); //result.property(inc, relatedModels.map((rm) => rm.allProperties()));
      });
      return await Promise.all(includePromises);
    });
    return await Promise.all(resultPromises);
  }

};
//# sourceMappingURL=base-model.js.map