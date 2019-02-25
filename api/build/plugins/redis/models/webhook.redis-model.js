"use strict";

var _constants = require("../../../util/constants");

var _baseModel = _interopRequireDefault(require("../lib/base-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  webhookUrl: {
    type: 'string'
  },
  webhookVerb: {
    type: 'string'
  },
  webhookPayloadType: {
    type: 'string'
  },
  webhookPayload: {
    type: 'string'
  },
  webhookHeaders: {
    type: 'json'
  },
  webhookUser: {
    type: 'string'
  },
  webhookPassword: {
    type: 'string'
  },
  creationDate: {
    type: 'timestamp'
  },
  modificationDate: {
    type: 'timestamp'
  }
};

class WebhookRedisModel extends _baseModel.default {
  constructor() {
    super({
      schema
    });
  }

  static get modelName() {
    return _constants.MODEL_WEBHOOK;
  }

  static get idGenerator() {
    return 'increment';
  }

  static get definitions() {
    return schema;
  }

}

module.exports = WebhookRedisModel;
//# sourceMappingURL=webhook.redis-model.js.map