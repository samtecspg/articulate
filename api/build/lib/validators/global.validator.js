"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AgentValidate {
  constructor() {
    this.searchByfield = {
      params: (() => {
        return {
          [_constants.PARAM_FIELD]: _joi.default.string().required().description('Field name. Must be indexed. If unique then a single value will be returned.'),
          [_constants.PARAM_VALUE]: _joi.default.string().required().description('Value to search for')
        };
      })()
    };
    this.findAll = {
      query: (() => {
        return {
          [_constants.PARAM_SKIP]: _joi.default.number().integer().optional().description('Number of resources to skip. Default=0'),
          [_constants.PARAM_LIMIT]: _joi.default.number().integer().optional().description('Number of resources to return. Default=50'),
          [_constants.PARAM_DIRECTION]: _joi.default.string().optional().allow('ASC', 'DESC').description('Sort direction. Default= ASC'),
          [_constants.PARAM_FIELD]: _joi.default.string().optional().description('Field used to do the sorting'),
          [_constants.PARAM_FILTER]: _joi.default.object().optional().description('Values to filter the the results (experimental). Arrays will be treated as OR values.')
        };
      })()
    };
  }

}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
//# sourceMappingURL=global.validator.js.map