"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DocumentModel {
  static get schema() {
    return {
      id: _joi.default.string().description('Id').trim(),
      document: _joi.default.string().description('Document').trim(),
      time_stamp: _joi.default.date().description('Timestamp'),
      maximum_saying_score: _joi.default.number().description('Maximum Saying Score'),
      maximum_category_score: _joi.default.number().description('Maximum Domain Score'),
      total_elapsed_time_ms: _joi.default.number().description('Total Elapsed Time (ms)'),
      rasa_results: _joi.default.array().items(_joi.default.object()).description('RASA Results'),
      session: _joi.default.string().description('Session').trim(),
      agent_id: _joi.default.number().description('Agent Id'),
      agent_model: _joi.default.string().description('Agent Model').trim(),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string(),
      webhookResponses: _joi.default.array().items(_joi.default.any())
    };
  }

}

module.exports = DocumentModel;
//# sourceMappingURL=document.model.js.map