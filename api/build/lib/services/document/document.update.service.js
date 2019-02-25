"use strict";

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  id,
  data
}) {
  const es = this.server.app.es;

  const _ref = await this.server.services(),
        documentService = _ref.documentService;

  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    const original = await documentService.findById({
      id
    });

    const merged = _objectSpread({}, original, {
      id: undefined
    }, data);

    await DocumentModel.updateInstance({
      id,
      data: merged
    });
    return _objectSpread({}, merged, {
      id
    });
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.update.service.js.map