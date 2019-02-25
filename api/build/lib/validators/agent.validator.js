"use strict";

var _joi = _interopRequireDefault(require("joi"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../../util/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AgentSchema = require('../models/agent.model').schema;

const CategorySchema = require('../models/category.model').schema;

const ActionSchema = require('../models/action.model').schema;

const ActionResponseSchema = require('../models/action.response.model').schema;

const SlotSchema = require('../models/slot.model').schema;

const KeywordSchema = require('../models/keyword.model').schema;

const PostFormatSchema = require('../models/postFormat.model').schema;

const WebhookSchema = require('../models/webhook.model').schema;

const KeywordExampledSchema = require('../models/keyword-example.model').schema;

const SettingsSchema = require('../models/settings.model').schema;

const SayingSchema = require('../models/saying.model').schema;

const SayingKeywordSchema = require('../models/saying.keyword.model').schema;

const ParseSchema = require('../models/parse.model').schema;

const ModifierSchema = require('../models/modifier.model').schema;

const ModifierSayingSchema = require('../models/modifier.saying.model').schema;

const DocumentSchema = require('../models/document.model').schema;

class AgentValidate {
  constructor() {
    this.findAllCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.create = {
      payload: (() => {
        return {
          agentName: AgentSchema.agentName.required(),
          description: AgentSchema.description,
          language: AgentSchema.language.required(),
          timezone: AgentSchema.timezone.required(),
          useWebhook: AgentSchema.useWebhook.required(),
          usePostFormat: AgentSchema.usePostFormat.required(),
          multiCategory: AgentSchema.multiCategory.required(),
          categoryRecognizer: AgentSchema.categoryRecognizer,
          modifiersRecognizer: AgentSchema.modifiersRecognizer,
          modifiersRecognizerJustER: AgentSchema.modifiersRecognizerJustER,
          categoryClassifierThreshold: AgentSchema.categoryClassifierThreshold.required(),
          fallbackAction: AgentSchema.fallbackAction,
          extraTrainingData: AgentSchema.extraTrainingData,
          enableModelsPerCategory: AgentSchema.enableModelsPerCategory,
          parameters: _joi.default.object()
        };
      })()
    };
    this.remove = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.createCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          categoryName: CategorySchema.categoryName.required(),
          enabled: CategorySchema.enabled.required(),
          actionThreshold: CategorySchema.actionThreshold.required(),
          lastTraining: CategorySchema.lastTraining,
          model: CategorySchema.model,
          extraTrainingData: CategorySchema.extraTrainingData,
          parameters: _joi.default.object()
        };
      })()
    };
    this.createAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          actionName: ActionSchema.actionName.required().regex(/\+__\+/, {
            invert: true
          }).error(new Error(`The action name is required or it contains the text "${_constants.RASA_INTENT_SPLIT_SYMBOL}" which restricted.`)),
          useWebhook: ActionSchema.useWebhook.required().error(new Error('Please specify if this action use a webhook for fulfilment.')),
          usePostFormat: ActionSchema.usePostFormat.required().error(new Error('Please specify if this action use a post format for fulfilment.')),
          responses: _joi.default.array().items({
            textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
            actions: ActionResponseSchema.actions
          }).required().min(1).error(new Error('Please specify at least one response.')),
          slots: _joi.default.array().items({
            slotName: SlotSchema.slotName.required(),
            uiColor: SlotSchema.uiColor.required(),
            keywordId: SlotSchema.keywordId,
            keyword: SlotSchema.keyword,
            isList: SlotSchema.isList.required(),
            isRequired: SlotSchema.isRequired.required(),
            textPrompts: SlotSchema.textPrompts,
            remainingLife: SlotSchema.remainingLife
          })
        };
      })()
    };
    this.updateAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })(),
      payload: (() => {
        return {
          actionName: ActionSchema.actionName,
          useWebhook: ActionSchema.useWebhook,
          usePostFormat: ActionSchema.usePostFormat,
          responses: _joi.default.array().items({
            textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
            actions: ActionResponseSchema.actions
          }).min(1).error(new Error('Please specify at least one response.')),
          slots: _joi.default.array().items({
            slotName: SlotSchema.slotName.required(),
            uiColor: SlotSchema.uiColor.required(),
            keywordId: SlotSchema.keywordId,
            keyword: SlotSchema.keyword,
            isList: SlotSchema.isList.required(),
            isRequired: SlotSchema.isRequired.required(),
            textPrompts: SlotSchema.textPrompts,
            remainingLife: SlotSchema.remainingLife
          }),
          creationDate: ActionSchema.creationDate,
          modificationDate: ActionSchema.modificationDate
        };
      })()
    };
    this.createKeyword = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          keywordName: KeywordSchema.keywordName.required(),
          uiColor: KeywordSchema.uiColor,
          regex: KeywordSchema.regex.allow('').allow(null),
          type: KeywordSchema.type.allow('').allow(null).valid('learned', 'regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
          examples: _joi.default.array().items({
            value: KeywordExampledSchema.value.required(),
            synonyms: KeywordExampledSchema.synonyms.required()
          }).min(1).required(),
          modifiers: _joi.default.array().items({
            modifierName: ModifierSchema.modifierName.required(),
            action: ModifierSchema.action.required(),
            valueSource: ModifierSchema.valueSource.required(),
            staticValue: ModifierSchema.staticValue,
            sayings: _joi.default.array().items({
              userSays: ModifierSayingSchema.userSays.required(),
              keywords: _joi.default.array().items({
                start: SayingKeywordSchema.start.required(),
                end: SayingKeywordSchema.end.required(),
                value: SayingKeywordSchema.value.required(),
                keyword: SayingKeywordSchema.keyword.required(),
                keywordId: SayingKeywordSchema.keywordId.required(),
                extractor: SayingKeywordSchema.extractor
              })
            })
          })
        };
      })()
    };
    this.updateById = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          agentName: AgentSchema.agentName,
          description: AgentSchema.description,
          language: AgentSchema.language,
          timezone: AgentSchema.timezone,
          useWebhook: AgentSchema.useWebhook,
          usePostFormat: AgentSchema.usePostFormat,
          multiCategory: AgentSchema.multiCategory,
          categoryClassifierThreshold: AgentSchema.categoryClassifierThreshold,
          fallbackAction: AgentSchema.fallbackAction,
          status: AgentSchema.status,
          lastTraining: AgentSchema.lastTraining.allow(''),
          extraTrainingData: AgentSchema.extraTrainingData,
          enableModelsPerCategory: AgentSchema.enableModelsPerCategory,
          model: AgentSchema.model.allow(''),
          categoryRecognizer: AgentSchema.categoryRecognizer,
          modifiersRecognizer: AgentSchema.modifiersRecognizer,
          modifiersRecognizerJustER: AgentSchema.modifiersRecognizerJustER,
          creationDate: AgentSchema.creationDate,
          modificationDate: AgentSchema.modificationDate,
          parameters: _joi.default.object()
        };
      })()
    };
    this.addPostFormat = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          postFormatPayload: PostFormatSchema.postFormatPayload.required()
        };
      })()
    };
    this.addWebhook = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
          webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
          webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
          webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
          webhookHeaders: _joi.default.array().items({
            key: _joi.default.string(),
            value: _joi.default.string()
          }),
          webhookUser: WebhookSchema.webhookUser,
          webhookPassword: WebhookSchema.webhookPassword
        };
      })()
    };
    this.updateWebhook = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          webhookUrl: WebhookSchema.webhookUrl,
          webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
          webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
          webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
          webhookHeaders: _joi.default.array().items({
            key: _joi.default.string(),
            value: _joi.default.string()
          }),
          webhookUser: WebhookSchema.webhookUser,
          webhookPassword: WebhookSchema.webhookPassword,
          creationDate: WebhookSchema.creationDate,
          modificationDate: WebhookSchema.modificationDate
        };
      })()
    };
    this.addWebhookInAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })(),
      payload: (() => {
        return {
          webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
          webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
          webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
          webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
          webhookHeaders: _joi.default.array().items({
            key: _joi.default.string(),
            value: _joi.default.string()
          }),
          webhookUser: WebhookSchema.webhookUser,
          webhookPassword: WebhookSchema.webhookPassword
        };
      })()
    };
    this.updateWebhookInAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })(),
      payload: (() => {
        return {
          webhookUrl: WebhookSchema.webhookUrl,
          webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
          webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
          webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
          webhookHeaders: _joi.default.array().items({
            key: _joi.default.string(),
            value: _joi.default.string()
          }),
          webhookUser: WebhookSchema.webhookUser,
          webhookPassword: WebhookSchema.webhookPassword,
          creationDate: WebhookSchema.creationDate,
          modificationDate: WebhookSchema.modificationDate
        };
      })()
    };
    this.removeWebhook = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.removeWebhookInAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })()
    };
    this.removePostFormat = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.removePostFormatInAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })()
    };
    this.addPostFormatInAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })(),
      payload: (() => {
        return {
          postFormatPayload: PostFormatSchema.postFormatPayload.required()
        };
      })()
    };
    this.findAllSayings = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      query: (() => {
        return {
          loadCategoryId: _joi.default.boolean().default(false),
          [_constants.PARAM_SKIP]: _joi.default.number().integer().optional().description('Number of resources to skip. Default=0'),
          [_constants.PARAM_LIMIT]: _joi.default.number().integer().optional().description('Number of resources to return. Default=50'),
          [_constants.PARAM_DIRECTION]: _joi.default.string().optional().allow(_constants.SORT_ASC, _constants.SORT_DESC).description('Sort direction. Default= ASC'),
          [_constants.PARAM_FIELD]: _joi.default.string().optional().description('Field used to do the sorting'),
          [_constants.PARAM_FILTER]: _joi.default.object().optional().description('Values to filter the the results (experimental). Arrays will be treated as OR values.'),
          [_constants.PARAM_INCLUDE]: _joi.default.array().items(_joi.default.string()).optional().description('Array of related models to be included')
        };
      })()
    };
    this.findAllDocuments = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      query: (() => {
        return {
          [_constants.PARAM_SKIP]: _joi.default.number().integer().optional().description('Number of resources to skip. Default=0'),
          [_constants.PARAM_LIMIT]: _joi.default.number().integer().optional().description('Number of resources to return. Default=50'),
          [_constants.PARAM_DIRECTION]: _joi.default.string().optional().allow(_constants.SORT_ASC, _constants.SORT_DESC).description('Sort direction. Default= ASC'),
          [_constants.PARAM_FIELD]: _joi.default.string().allow((0, _lodash.default)(DocumentSchema).keys().sort().value()).optional().description('Field to sort with. Default= "time_stamp"')
        };
      })()
    };
    this.findAllSettings = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.findSettingByName = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_NAME]: SettingsSchema.name.required().allow(_constants.CONFIG_SETTINGS_DEFAULT_AGENT).description('Setting name')
        };
      })()
    };
    this.updateAllSettings = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        const keys = {};

        _constants.CONFIG_SETTINGS_DEFAULT_AGENT.forEach(key => {
          keys[key] = SettingsSchema.value.optional();
        });

        return _joi.default.object().keys(keys);
      })()
    };
    this.updateSayingInCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category'),
          [_constants.PARAM_SAYING_ID]: SayingSchema.id.required().description('Id of the saying')
        };
      })(),
      payload: (() => {
        return {
          userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
          keywords: _joi.default.array().items({
            value: SayingKeywordSchema.value.required().error(new Error('You must specify the value that this keyword represents in the user saying')),
            keyword: SayingKeywordSchema.keyword.required().error(new Error('You must specify the keyword name')),
            keywordId: KeywordSchema.id.required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
            start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
            end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
            extractor: SayingKeywordSchema.extractor
          }).required().allow([]),
          actions: SayingSchema.actions.allow([]),
          creationDate: SayingSchema.creationDate,
          modificationDate: SayingSchema.modificationDate
        };
      })()
    };
    this.createSayingInCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
        };
      })(),
      payload: (() => {
        return {
          userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
          keywords: _joi.default.array().items({
            value: SayingKeywordSchema.value.required().error(new Error('You must specify the value that this keyword represents in the user saying')),
            keyword: SayingKeywordSchema.keyword.required().error(new Error('You must specify the keyword name')),
            keywordId: KeywordSchema.id.required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
            start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
            end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
            extractor: SayingKeywordSchema.extractor
          }).required().allow([]),
          actions: SayingSchema.actions.allow([])
        };
      })()
    };
    this.updateKeyword = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
        };
      })(),
      payload: (() => {
        return {
          keywordName: KeywordSchema.keywordName,
          uiColor: KeywordSchema.uiColor,
          regex: KeywordSchema.regex.allow('').allow(null),
          type: KeywordSchema.type.allow('').allow(null).valid(_constants.CONFIG_KEYWORD_TYPE_LEARNED, _constants.CONFIG_KEYWORD_TYPE_REGEX).optional().default(_constants.CONFIG_KEYWORD_TYPE_LEARNED).error(new Error('Please provide valid keyword type among learned and regex')),
          examples: _joi.default.array().items({
            value: KeywordExampledSchema.value.required(),
            synonyms: KeywordExampledSchema.synonyms.required()
          }),
          modifiers: _joi.default.array().items({
            modifierName: ModifierSchema.modifierName.required(),
            action: ModifierSchema.action.required(),
            valueSource: ModifierSchema.valueSource.required(),
            staticValue: ModifierSchema.staticValue,
            sayings: _joi.default.array().items({
              userSays: ModifierSayingSchema.userSays.required(),
              keywords: _joi.default.array().items({
                start: SayingKeywordSchema.start.required(),
                end: SayingKeywordSchema.end.required(),
                value: SayingKeywordSchema.value.required(),
                keyword: SayingKeywordSchema.keyword.required(),
                keywordId: SayingKeywordSchema.keywordId.required(),
                extractor: SayingKeywordSchema.extractor
              })
            })
          }),
          creationDate: KeywordSchema.creationDate,
          modificationDate: KeywordSchema.modificationDate
        };
      })()
    };
    this.updateCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
        };
      })(),
      payload: (() => {
        return {
          actionThreshold: CategorySchema.actionThreshold,
          categoryName: CategorySchema.categoryName,
          enabled: CategorySchema.enabled,
          extraTrainingData: CategorySchema.extraTrainingData,
          lastTraining: CategorySchema.lastTraining,
          model: CategorySchema.model,
          status: CategorySchema.status,
          creationDate: CategorySchema.creationDate,
          modificationDate: CategorySchema.modificationDate,
          parameters: _joi.default.object()
        };
      })()
    };
    this.trainCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
        };
      })()
    };
    this.train = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.converse = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          [_constants.PARAM_SESSION]: _joi.default.string().required().description('Id of the session'),
          [_constants.PARAM_TEXT]: _joi.default.string().required().description('Text to parse'),
          [_constants.PARAM_TIMEZONE]: _joi.default.string().description('Timezone for duckling parse. Default UTC')
        };
      })(),
      query: (() => {
        return {
          [_constants.PARAM_DEBUG]: _joi.default.boolean().optional().default(false)
        };
      })(),
      options: {
        allowUnknown: true
      }
    };
    this.removeAction = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
        };
      })()
    };
    this.removeSayingInCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category'),
          [_constants.PARAM_SAYING_ID]: SayingSchema.id.description('Id of the saying')
        };
      })()
    };
    this.removeCategory = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
        };
      })()
    };
    this.removeKeyword = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
          [_constants.PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
        };
      })()
    };
    this.export = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })()
    };
    this.import = {
      payload: (() => {
        return {
          agentName: AgentSchema.agentName.required(),
          description: AgentSchema.description,
          language: AgentSchema.language.required(),
          timezone: AgentSchema.timezone.required(),
          categoryClassifierThreshold: AgentSchema.categoryClassifierThreshold.required(),
          categoryRecognizer: AgentSchema.categoryRecognizer,
          modifiersRecognizer: AgentSchema.modifiersRecognizer,
          modifiersRecognizerJustER: AgentSchema.modifiersRecognizerJustER,
          fallbackAction: AgentSchema.fallbackAction,
          useWebhook: AgentSchema.useWebhook.required(),
          multiCategory: AgentSchema.multiCategory.required(),
          usePostFormat: AgentSchema.usePostFormat.required(),
          postFormat: {
            postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
          },
          status: AgentSchema.status,
          lastTraining: AgentSchema.lastTraining,
          extraTrainingData: AgentSchema.extraTrainingData,
          enableModelsPerCategory: AgentSchema.enableModelsPerCategory,
          model: AgentSchema.model,
          parameters: _joi.default.object(),
          webhook: {
            webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
            webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
            webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
            webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
            webhookHeaders: _joi.default.array().items({
              key: _joi.default.string(),
              value: _joi.default.string()
            }),
            webhookUser: WebhookSchema.webhookUser,
            webhookPassword: WebhookSchema.webhookPassword,
            creationDate: ActionSchema.creationDate,
            modificationDate: ActionSchema.modificationDate
          },
          settings: _joi.default.object(),
          keywords: _joi.default.array().items({
            keywordName: KeywordSchema.keywordName.required(),
            uiColor: KeywordSchema.uiColor,
            type: KeywordSchema.type.allow('').allow(null).valid('learned', 'regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
            regex: KeywordSchema.regex.allow('').allow(null),
            examples: _joi.default.array().items({
              value: KeywordExampledSchema.value.required(),
              synonyms: KeywordExampledSchema.synonyms
            }).required(),
            modifiers: _joi.default.array().items({
              modifierName: ModifierSchema.modifierName.required(),
              action: ModifierSchema.action.required(),
              valueSource: ModifierSchema.valueSource.required(),
              staticValue: ModifierSchema.staticValue,
              sayings: _joi.default.array().items({
                userSays: ModifierSayingSchema.userSays.required(),
                keywords: _joi.default.array().items({
                  start: SayingKeywordSchema.start.required(),
                  end: SayingKeywordSchema.end.required(),
                  value: SayingKeywordSchema.value.required(),
                  keyword: SayingKeywordSchema.keyword.required(),
                  keywordId: SayingKeywordSchema.keywordId.required(),
                  extractor: SayingKeywordSchema.extractor
                })
              })
            }),
            creationDate: KeywordSchema.creationDate,
            modificationDate: KeywordSchema.modificationDate
          }),
          categories: _joi.default.array().items({
            categoryName: CategorySchema.categoryName.required(),
            enabled: CategorySchema.enabled.required(),
            actionThreshold: CategorySchema.actionThreshold.required(),
            model: CategorySchema.model,
            status: CategorySchema.status,
            lastTraining: CategorySchema.lastTraining,
            extraTrainingData: CategorySchema.extraTrainingData,
            parameters: _joi.default.object(),
            sayings: _joi.default.array().items({
              userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
              actions: SayingSchema.actions.allow([]),
              keywords: _joi.default.array().items({
                keywordId: KeywordSchema.id.required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
                value: SayingKeywordSchema.value.required().error(new Error('You must specify the value that this keyword represents in the user saying')),
                keyword: SayingKeywordSchema.keyword.required().error(new Error('You must specify the keyword name')),
                start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                extractor: SayingKeywordSchema.extractor
              }).required().allow([]),
              creationDate: KeywordSchema.creationDate,
              modificationDate: KeywordSchema.modificationDate
            }),
            creationDate: KeywordSchema.creationDate,
            modificationDate: KeywordSchema.modificationDate
          }),
          actions: _joi.default.array().items({
            actionName: ActionSchema.actionName.required().error(new Error('The action name is required')),
            useWebhook: ActionSchema.useWebhook.required().error(new Error('Please specify if this action use a webhook for fullfilment.')),
            usePostFormat: ActionSchema.usePostFormat.required().error(new Error('Please specify if this action use a post format for fullfilment.')),
            postFormat: {
              postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
            },
            webhook: {
              webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
              webhookVerb: WebhookSchema.webhookVerb.required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
              webhookPayloadType: WebhookSchema.webhookPayloadType.required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
              webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
              webhookHeaders: _joi.default.array().items({
                key: _joi.default.string(),
                value: _joi.default.string()
              }),
              webhookUser: WebhookSchema.webhookUser,
              webhookPassword: WebhookSchema.webhookPassword,
              creationDate: ActionSchema.creationDate,
              modificationDate: ActionSchema.modificationDate
            },
            responses: _joi.default.array().items({
              textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
              actions: ActionResponseSchema.actions
            }).required().min(1).error(new Error('Please specify at least one response.')),
            slots: _joi.default.array().items({
              slotName: SlotSchema.slotName.required(),
              uiColor: SlotSchema.uiColor.required(),
              keywordId: SlotSchema.keywordId,
              keyword: SlotSchema.keyword,
              isList: SlotSchema.isList.required(),
              isRequired: SlotSchema.isRequired.required(),
              textPrompts: SlotSchema.textPrompts,
              remainingLife: SlotSchema.remainingLife
            }),
            creationDate: KeywordSchema.creationDate,
            modificationDate: KeywordSchema.modificationDate
          }),
          creationDate: KeywordSchema.creationDate,
          modificationDate: KeywordSchema.modificationDate
        };
      })()
    };
    this.parseGet = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      query: (() => {
        return {
          text: ParseSchema.text.required(),
          timezone: ParseSchema.timezone
        };
      })()
    };
    this.parsePost = {
      params: (() => {
        return {
          [_constants.PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
        };
      })(),
      payload: (() => {
        return {
          text: ParseSchema.text.required(),
          timezone: ParseSchema.timezone
        };
      })()
    };
  }

}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
//# sourceMappingURL=agent.validator.js.map