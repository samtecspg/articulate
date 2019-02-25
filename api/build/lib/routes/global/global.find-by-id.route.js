"use strict";

var _boom = _interopRequireDefault(require("boom"));

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//const logger = require('../../../server/util/logger')({ name: `route:global:search-by-field` });
module.exports = ({
  ROUTE
}) => {
  return {
    method: 'get',
    path: `/${ROUTE}/{${ROUTE + _constants.PARAMS_POSTFIX_ID}}`,
    options: {
      tags: ['api'],
      validate: {
        params: (() => {
          return {
            [`${ROUTE + _constants.PARAMS_POSTFIX_ID}`]: _joi.default.string().required().description(`${_constants.ROUTE_TO_MODEL[ROUTE]} id`)
          };
        })()
      },
      handler: async request => {
        const _ref = await request.services(),
              globalService = _ref.globalService;

        const id = request.params[`${ROUTE + _constants.PARAMS_POSTFIX_ID}`];

        try {
          return await globalService.findById({
            id,
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
//# sourceMappingURL=global.find-by-id.route.js.map