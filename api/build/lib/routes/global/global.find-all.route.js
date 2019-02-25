"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../validators/global.validator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = ({
  ROUTE
}) => {
  return {
    method: 'get',
    path: `/${ROUTE}`,
    options: {
      tags: ['api'],
      validate: _global.default.findAll,
      handler: async request => {
        const _ref = await request.services(),
              globalService = _ref.globalService;

        const _request$query = request.query,
              skip = _request$query[_constants.PARAM_SKIP],
              limit = _request$query[_constants.PARAM_LIMIT],
              direction = _request$query[_constants.PARAM_DIRECTION],
              field = _request$query[_constants.PARAM_FIELD],
              filter = _request$query[_constants.PARAM_FILTER];

        try {
          return await globalService.findAll({
            skip,
            limit,
            direction,
            field,
            model: _constants.ROUTE_TO_MODEL[ROUTE],
            filter
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
//# sourceMappingURL=global.find-all.route.js.map