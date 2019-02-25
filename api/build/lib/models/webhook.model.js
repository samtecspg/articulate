"use strict";

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebhookModel {
  static get schema() {
    return {
      id: _joi.default.number(),
      webhookUrl: _joi.default.string().trim(),
      webhookVerb: _joi.default.string().valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').trim(),
      webhookPayloadType: _joi.default.string().valid('None', 'JSON', 'XML').trim(),
      webhookPayload: _joi.default.string().trim(),
      webhookHeaders: _joi.default.array().items({
        key: _joi.default.string(),
        value: _joi.default.string()
      }),
      webhookUser: _joi.default.string().allow(''),
      webhookPassword: _joi.default.string().allow(''),
      creationDate: _joi.default.string(),
      modificationDate: _joi.default.string()
    };
  }

}

module.exports = WebhookModel;
//# sourceMappingURL=webhook.model.js.map