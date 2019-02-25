"use strict";

var _constants = require("../../../util/constants");

var _global = _interopRequireDefault(require("../../errors/global.not-found-error"));

var _redis = _interopRequireDefault(require("../../errors/redis.error-handler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//const logger = require('../../../server/util/logger')({ name: `service:agent:export` });
const exportMap = model => model.export();

const returnModel = true;
const TYPE_WEBHOOK = 'webhook';
const TYPE_POST_FORMAT = 'postFormat';
const USE_WEBHOOK = 'useWebhook';
const USE_POST_FORMAT = 'usePostFormat';

module.exports = async function ({
  id
}) {
  const redis = this.server.app.redis;

  const _ref = await this.server.services(),
        globalService = _ref.globalService;

  let exported = {};

  const loadWebhookOrPostFormat = async ({
    parentModel,
    type
  }) => {
    const modelName = type === TYPE_WEBHOOK ? _constants.MODEL_WEBHOOK : _constants.MODEL_POST_FORMAT;
    const property = type === TYPE_WEBHOOK ? USE_WEBHOOK : USE_POST_FORMAT;

    if (!parentModel.property(property)) {
      return {};
    }

    const Model = await globalService.loadFirstLinked({
      parentModel,
      model: modelName,
      returnModel
    });

    if (Model.isLoaded) {
      return {
        [type]: Model.export()
      };
    }
  };

  try {
    const AgentModel = await redis.factory(_constants.MODEL_AGENT, id);

    if (!AgentModel.isLoaded) {
      return Promise.reject((0, _global.default)({
        id,
        model: _constants.MODEL_AGENT
      }));
    } // [Agent]


    exported = AgentModel.export(); // [Agent] [Action]

    const ActionModels = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_ACTION,
      returnModel
    });
    exported = _objectSpread({}, exported, {
      actions: await Promise.all(ActionModels.map(async ActionModel => {
        // [Agent] [Action] [Webhook]
        const webhook = await loadWebhookOrPostFormat({
          parentModel: ActionModel,
          type: TYPE_WEBHOOK
        }); // [Agent] [Action] [PostFormat]

        const postFormat = await loadWebhookOrPostFormat({
          parentModel: ActionModel,
          type: TYPE_POST_FORMAT
        });
        return _objectSpread({}, ActionModel.export(), webhook, postFormat);
      }))
    }); // [Agent] [Category]

    const CategoryModels = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_CATEGORY,
      returnModel
    });
    exported = _objectSpread({}, exported, {
      categories: await Promise.all(CategoryModels.map(async CategoryModel => {
        // [Agent] [Category] [Saying]
        const CategorySayingModels = await globalService.loadAllLinked({
          parentModel: CategoryModel,
          model: _constants.MODEL_SAYING,
          returnModel
        });
        return _objectSpread({}, CategoryModel.export(), {
          sayings: CategorySayingModels.map(exportMap)
        });
      }))
    }); // [Agent] [Keyword]

    const KeywordModels = await globalService.loadAllLinked({
      parentModel: AgentModel,
      model: _constants.MODEL_KEYWORD,
      returnModel
    });
    exported = _objectSpread({}, exported, {
      keywords: KeywordModels.map(exportMap)
    }); // [Agent] [PostFormat]

    const webhook = await loadWebhookOrPostFormat({
      parentModel: AgentModel,
      type: TYPE_WEBHOOK
    }); // [Agent] [Webhook]

    const postFormat = await loadWebhookOrPostFormat({
      parentModel: AgentModel,
      type: TYPE_POST_FORMAT
    });
    exported = _objectSpread({}, exported, webhook, postFormat);
    return exported;
  } catch (error) {
    throw (0, _redis.default)({
      error
    });
  }
};
//# sourceMappingURL=agent.export.service.js.map