"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _util = _interopRequireDefault(require("util"));

var _constants = require("../../../util/constants");

var _es = _interopRequireDefault(require("../../errors/es.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

module.exports = async function ({
  agentId,
  direction = _constants.SORT_DESC,
  skip = 0,
  limit = 50,
  field = 'time_stamp'
}) {
  const es = this.server.app.es;
  const DocumentModel = es.models[_constants.MODEL_DOCUMENT];

  try {
    const body = {
      'from': skip,
      'size': limit,
      'sort': [{
        [field]: {
          'order': direction.toLowerCase(),
          'missing': 0
        }
      }],
      'query': {
        'match': {
          'agent_id': agentId
        }
      }
    };
    const results = await DocumentModel.search({
      body
    });

    if (results.hits.total === 0) {
      return {
        data: [],
        totalCount: 0
      };
    }

    const data = results.hits.hits.map(result => _objectSpread({
      id: result._id
    }, result._source));
    return {
      data,
      totalCount: results.hits.total
    };
  } catch (error) {
    throw (0, _es.default)({
      error
    });
  }
};
//# sourceMappingURL=document.find-by-agent-id.service.js.map