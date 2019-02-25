"use strict";

var _schmervice = _interopRequireDefault(require("schmervice"));

var _webhookCreate = _interopRequireDefault(require("./webhook/webhook.create.service"));

var _webhookRemove = _interopRequireDefault(require("./webhook/webhook.remove.service"));

var _webhookUpdate = _interopRequireDefault(require("./webhook/webhook.update.service"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = class WebhookService extends _schmervice.default.Service {
  async create() {
    return await _webhookCreate.default.apply(this, arguments);
  }

  async update() {
    return await _webhookUpdate.default.apply(this, arguments);
  }

  async remove() {
    return await _webhookRemove.default.apply(this, arguments);
  }

};
//# sourceMappingURL=webhook.services.js.map