"use strict";

var _constants = require("../../../util/constants");

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  direction,
  skip,
  limit,
  field
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        documentService = _ref.documentService;

  try {
    await globalService.findById({
      id,
      model: _constants.MODEL_AGENT,
      returnModel: true
    });
    return await documentService.findByAgentId({
      agentId: id,
      direction,
      skip,
      limit,
      field
    });
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.find-all-documents.service.js.map