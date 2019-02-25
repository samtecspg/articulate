"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../validators/global.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:global:search-by-field` });
module.exports = ({
  ROUTE
}) => {
  return {
    method: 'get',
    path: `/${ROUTE}/${_constants.PARAM_SEARCH}/{${_constants.PARAM_FIELD}}/{${_constants.PARAM_VALUE}}`,
    options: {
      tags: ['api'],
      validate: _global.default.searchByfield,
      handler: async request => {
        const _ref = await request.services(),
              globalService = _ref.globalService;

        const _request$params = request.params,
              field = _request$params[_constants.PARAM_FIELD],
              value = _request$params[_constants.PARAM_VALUE];

        try {
          return await globalService.searchByField({
            field,
            value,
            model: _constants.ROUTE_TO_MODEL[ROUTE]
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
};
//# sourceMappingURL=global.search-by-field.route.js.map