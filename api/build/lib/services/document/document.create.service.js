"use strict";

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  data
}) {
  const es = this.server.app.es;

  const _ref = await this.server.services(),
        documentService = _ref.documentService;

  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    const result = await DocumentModel.createInstance({
      data
    });
    data.id = result._id;
    const agentDocuments = await documentService.findByAgentId({
      agentId: data.agent_id
    });
    this.server.publish(`/${_constants.ROUTE_AGENT}/${data.agent_id}/${_constants.ROUTE_DOCUMENT}`, agentDocuments);
    return data;
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.create.service.js.map