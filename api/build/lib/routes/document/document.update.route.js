"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _document = _interopRequireDefault(require("../../validators/document.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'put',
  path: `/${_constants.ROUTE_DOCUMENT}/{${_constants.PARAM_DOCUMENT_ID}}`,
  options: {
    tags: ['api'],
    validate: _document.default.update,
    handler: async request => {
      const _ref = await request.services(),
            documentService = _ref.documentService;

      const id = request.params[_constants.PARAM_DOCUMENT_ID];

      try {
        return await documentService.update({
          id,
          data: request.payload
        });
      } catch (_ref2) {
        let message = _ref2.message;
        let statusCode = _ref2.statusCode;
        return new _boom.default(message, {
          statusCode
        });
      }
    }
  }
};
//# sourceMappingURL=document.update.route.js.map