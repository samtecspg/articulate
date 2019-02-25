"use strict";

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  id,
  returnModel = false
}) {
  const es = this.server.app.es;
  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    const doc = await DocumentModel.findById({
      id,
      refresh: true
    });

    if (returnModel) {
      return doc;
    }

    return _objectSpread({
      id: doc._id
    }, doc._source);
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.find-by-id.service.js.map