"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

module.exports = async function ({
  id,
  loadCategoryId,
  skip,
  limit,
  direction,
  field,
  filter = {}
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  const redis = this.server.app.redis;

  try {
    const AgentModel = await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    });
    const sayingsIds = await AgentModel.getAll(_constants.MODEL_SAYING, _constants.MODEL_SAYING);

    let _filter$category = filter.category,
        categoryFilter = _filter$category === void 0 ? [] : _filter$category,
        _filter$actions = filter.actions,
        actionFilter = _filter$actions === void 0 ? [] : _filter$actions,
        query = filter.query,
        restOfFilters = _objectWithoutProperties(filter, ["category", "actions", "query"]);

    let newFilter = restOfFilters;

    if (query) {
      newFilter = _objectSpread({}, newFilter, {
        userSays: query
      });
    }

    const allSayings = await Promise.all(sayingsIds.map(async sayingId => {
      return await globalService.loadWithIncludes({
        model: _constants.MODEL_SAYING,
        id: sayingId,
        relationNames: [_constants.MODEL_CATEGORY, _constants.MODEL_ACTION]
      });
    }));
    categoryFilter = _lodash.default.isArray(categoryFilter) ? categoryFilter : [categoryFilter];
    actionFilter = _lodash.default.isArray(actionFilter) ? actionFilter : [actionFilter];
    let filteredSayings = allSayings;

    if (categoryFilter.length > 0) {
      filteredSayings = filteredSayings.filter(saying => {
        const categories = _lodash.default.map(saying[_constants.MODEL_CATEGORY], 'categoryName');

        return _lodash.default.includes(categories, ...categoryFilter);
      });
    }

    if (actionFilter.length > 0) {
      filteredSayings = filteredSayings.filter(saying => {
        return _lodash.default.includes(saying.actions, ...actionFilter);
      });
    }

    const SayingModel = await redis.factory(_constants.MODEL_SAYING); // Can't perform a count with a filter, so we need to query all the sayings and then apply the filter

    const SayingModelsCount = await SayingModel.findAllByIds({
      ids: _lodash.default.map(filteredSayings, 'id'),
      limit: -1,
      filter: newFilter
    });
    const SayingModels = await SayingModel.findAllByIds({
      ids: _lodash.default.map(filteredSayings, 'id'),
      skip,
      limit,
      direction,
      field,
      filter: newFilter
    });
    const totalCount = SayingModelsCount.length;
    const data = SayingModels.map(sayingModel => {
      const saying = _lodash.default.find(filteredSayings, {
        id: sayingModel.id
      });

      if (loadCategoryId) {
        return _objectSpread({}, saying, {
          category: _lodash.default.get(saying, `${_constants.MODEL_CATEGORY}[0].id`, null)
        });
      } //return _.omit(saying, [MODEL_CATEGORY, MODEL_ACTION]);


      return saying;
    });
    return {
      data,
      totalCount
    };
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.find-all-sayings.service.js.map