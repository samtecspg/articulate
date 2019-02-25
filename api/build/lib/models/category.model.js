"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CategoryModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      agent: _joi.default.string().trim(),
      categoryName: _joi.default.string().trim(),
      enabled: _joi.default.boolean(),
      actionThreshold: _joi.default.number(),
      status: _joi.default.string().trim().valid(_constants.STATUS_READY, _constants.STATUS_TRAINING, _constants.STATUS_ERROR, _constants.STATUS_OUT_OF_DATE),
      lastTraining: _joi.default.date().allow(''),
      model: _joi.default.string().trim().allow(''),
      extraTrainingData: _joi.default.boolean(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string(),
      parameters: _joi.default.object()
    };
  }

}

module.exports = CategoryModel;
//# sourceMappingURL=category.model.js.map