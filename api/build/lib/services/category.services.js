"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _serviceTimingWrapper = _interopRequireDefault(require("../../util/service-timing-wrapper"));

var _categoryCreate = _interopRequireDefault(require("./category/category.create.service"));

var _categoryFindAllByIds = _interopRequireDefault(require("./category/category.find-all-by-ids.service"));

var _categoryFindById = _interopRequireDefault(require("./category/category.find-by-id.service"));

var _categoryGenerateTrainingData = _interopRequireDefault(require("./category/category.generate-training-data.service"));

var _categoryLinkKeywords = _interopRequireDefault(require("./category/category.link-keywords.service"));

var _categoryRemove = _interopRequireDefault(require("./category/category.remove.service"));

var _categoryTrain = _interopRequireDefault(require("./category/category.train.service"));

var _categoryUnlinkKeywords = _interopRequireDefault(require("./category/category.unlink-keywords.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class CategoryService extends _schmervice.default.Service {
  async create() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryCreate.default,
      name: 'CategoryService.create'
    }).apply(this, arguments);
  }

  async findAllByIds() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryFindAllByIds.default,
      name: 'CategoryService.findAllByIds'
    }).apply(this, arguments);
  }

  async findById() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryFindById.default,
      name: 'CategoryService.findById'
    }).apply(this, arguments);
  }

  async remove() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryRemove.default,
      name: 'CategoryService.remove'
    }).apply(this, arguments);
  }

  async linkKeywords() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryLinkKeywords.default,
      name: 'CategoryService.linkKeywords'
    }).apply(this, arguments);
  }

  async unlinkKeywords() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryUnlinkKeywords.default,
      name: 'CategoryService.unlinkKeywords'
    }).apply(this, arguments);
  }

  async train() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryTrain.default,
      name: 'CategoryService.train'
    }).apply(this, arguments);
  }

  async generateTrainingData() {
    return await (0, _serviceTimingWrapper.default)({
      fn: _categoryGenerateTrainingData.default,
      name: 'CategoryService.generateTrainingData'
    }).apply(this, arguments);
  }

};
//# sourceMappingURL=category.services.js.map