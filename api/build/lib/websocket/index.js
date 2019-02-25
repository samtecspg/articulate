"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _lodash = _interopRequireDefault(require("lodash"));

var _requireDir = _interopRequireDefault(require("require-dir"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = {
  model: _joi.default.string().required().valid(_constants.MODEL_ALL).description('Model'),
  subscribePath: _joi.default.string().required().description('subscribePath'),
  publishPath: _joi.default.func().description('publishPath'),
  actions: _joi.default.array().items(_joi.default.string().valid(_constants.NOHM_SUB_ALL)).required().description('Actions'),
  isESModel: _joi.default.boolean().description('Specifies if the model is using ES as back end')
};

module.exports = async server => {
  const rm = server.app['redis-messaging'];
  const WebSockets = await (0, _requireDir.default)('.');
  await Promise.all(_lodash.default.map(WebSockets, async (ws, key) => {
    const validation = _joi.default.validate(ws, schema);

    if (validation.error) {
      return Promise.reject(`The WebSocket [${key}.js] is not valid.\n${validation.error}`);
    }

    try {
      if (ws.isESModel) {
        server.subscription(ws.subscribePath);
      } else {
        const model = await rm.factory(ws.model);

        if (!model.getPublish()) {
          return Promise.reject(`The model [${ws.model}] is not configured to publish.`);
        }

        server.subscription(ws.subscribePath);
        await Promise.all(_lodash.default.map(ws.actions, async action => {
          await model.subscribe(action, event => {
            const target = event.target;
            server.publish(ws.publishPath({
              properties: target.properties
            }), target.properties);
          });
        }));
      }
    } catch (error) {
      throw Error(error);
    }
  }));
};
//# sourceMappingURL=index.js.map