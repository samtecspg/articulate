"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = async function ({
  id,
  actionId
}) {
  const _ref = await this.server.services(),
        globalService = _ref.globalService,
        postFormatService = _ref.postFormatService;

  try {
    const modelPath = [{
      model: _constants.MODEL_AGENT,
      id
    }, {
      model: _constants.MODEL_ACTION,
      id: actionId
    }];
    let actionModel = await globalService.findInModelPath({
      modelPath,
      returnModel: true
    });
    actionModel = actionModel.data;
    const children = await actionModel.getAll(_constants.MODEL_POST_FORMAT, _constants.MODEL_POST_FORMAT);

    if (children.length > 0) {
      return await postFormatService.remove({
        id: children[0]
      });
    }

    return Promise.reject((0, _global.default)({
      model: _constants.MODEL_POST_FORMAT
    }));
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.remove-post-format-in-action.service.js.map