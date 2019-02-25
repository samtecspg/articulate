"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const properties = {
  document: {
    type: 'text'
  },
  time_stamp: {
    type: 'date'
  },
  maximum_saying_score: {
    type: 'float'
  },
  maximum_category_score: {
    type: 'float'
  },
  total_elapsed_time_ms: {
    type: 'text'
  },
  rasa_results: {
    type: 'object'
  },
  session: {
    type: 'text'
  },
  agent_id: {
    type: 'integer'
  },
  agent_model: {
    type: 'text'
  }
};
module.exports = class DocumentEsModel extends _baseModel.default {
  constructor({
    client
  }) {
    super({
      name: _constants.MODEL_DOCUMENT,
      properties,
      client
    });
  }

};
//# sourceMappingURL=document.es-model.js.map