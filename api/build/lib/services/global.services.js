"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _globalFindAll = _interopRequireDefault(require("./global/global.find-all.service"));

var _globalFindById = _interopRequireDefault(require("./global/global.find-by-id.service"));

var _globalFindInModelPath = _interopRequireDefault(require("./global/global.find-in-model-path.service"));

var _globalGetAllModelInPath = _interopRequireDefault(require("./global/global.get-all-model-in-path.service"));

var _globalLoadAllByIds = _interopRequireDefault(require("./global/global.load-all-by-ids.service"));

var _globalLoadAllLinked = _interopRequireDefault(require("./global/global.load-all-linked.service"));

var _globalLoadFirstLinked = _interopRequireDefault(require("./global/global.load-first-linked.service"));

var _globalLoadWithIncludes = _interopRequireDefault(require("./global/global.load-with-includes.service"));

var _globalSearchByField = _interopRequireDefault(require("./global/global.search-by-field.service"));

var _globalToolCartesianProduct = _interopRequireDefault(require("./global/global.tool-cartesian-product.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class GlobalService extends _schmervice.default.Service {
  async searchByField() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalSearchByField.default,
      name: 'GlobalService.searchByField'
    }).apply(this, arguments);
  }

  async findById() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalFindById.default,
      name: 'GlobalService.findById'
    }).apply(this, arguments);
  }

  async findAll() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalFindAll.default,
      name: 'GlobalService.findAll'
    }).apply(this, arguments);
  }

  async findInModelPath() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalFindInModelPath.default,
      name: 'GlobalService.findInModelPath'
    }).apply(this, arguments);
  }

  async loadAllByIds() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalLoadAllByIds.default,
      name: 'GlobalService.loadAllByIds'
    }).apply(this, arguments);
  }

  async getAllModelsInPath() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalGetAllModelInPath.default,
      name: 'GlobalService.getAllModelsInPath'
    }).apply(this, arguments);
  }

  async loadAllLinked() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalLoadAllLinked.default,
      name: 'GlobalService.loadAllLinked'
    }).apply(this, arguments);
  }

  async loadFirstLinked() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalLoadFirstLinked.default,
      name: 'GlobalService.loadFirstLinked'
    }).apply(this, arguments);
  }

  async cartesianProduct() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalToolCartesianProduct.default,
      name: 'GlobalService.cartesianProduct'
    }).apply(this, arguments);
  }

  async loadWithIncludes() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _globalLoadWithIncludes.default,
      name: 'GlobalService.loadWithIncludes'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=global.services.js.map