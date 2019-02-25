"use strict";

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id
}) {
  const es = this.server.app.es;
  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    await DocumentModel.removeInstance({
      id
    });
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.remove.service.js.map