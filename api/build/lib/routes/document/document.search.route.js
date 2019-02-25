"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _document = _interopRequireDefault(require("../../validators/document.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  method: 'post',
  path: `/${_constants.ROUTE_DOCUMENT}/${_constants.PARAM_SEARCH}`,
  options: {
    description: 'Search',
    tags: ['api'],
    notes: ['Search query over the Document index using full request definition in the Elasticsearch’s Query DSL'],
    validate: _document.default.search,
    handler: async request => {
      const _ref = await request.services(),
            documentService = _ref.documentService;

      try {
        return await documentService.search({
          body: request.payload
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
//# sourceMappingURL=document.search.route.js.map