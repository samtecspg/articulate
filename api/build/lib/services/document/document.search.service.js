"use strict";

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  body
}) {
  const es = this.server.app.es;
  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    return await DocumentModel.search({
      body
    });
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.search.service.js.map