import Joi from 'joi';
import {
    CONFIG_KEYWORD_TYPE_LEARNED,
    CONFIG_KEYWORD_TYPE_REGEX,
    CONFIG_SETTINGS_DEFAULT_AGENT,
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    PARAM_CATEGORY_ID,
    PARAM_DEBUG,
    PARAM_DIRECTION,
    PARAM_FIELD,
    PARAM_KEYWORD_ID,
    PARAM_LIMIT,
    PARAM_NAME,
    PARAM_SAYING_ID,
    PARAM_SESSION,
    PARAM_SKIP,
    PARAM_TEXT,
    PARAM_TIMEZONE,
    SORT_ASC,
    SORT_DESC
} from '../../util/constants';

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

class AgentValidate {
    constructor() {

        this.findAllCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
                    categoryClassifierThreshold: AgentSchema.categoryClassifierThreshold.required(),
                    fallbackResponses: AgentSchema.fallbackResponses.required().min(1).error(new Error('please add at least one fallback response for the agent')),
                    extraTrainingData: AgentSchema.extraTrainingData,
                    enableModelsPerCategory: AgentSchema.enableModelsPerCategory
                };
            })()
        };

        this.remove = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.createCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    categoryName: CategorySchema.categoryName.required(),
                    enabled: CategorySchema.enabled.required(),
                    actionThreshold: CategorySchema.actionThreshold.required(),
                    lastTraining: CategorySchema.lastTraining,
                    model: CategorySchema.model,
                    extraTrainingData: CategorySchema.extraTrainingData
                };
            })()
        };
        this.createAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    actionName: ActionSchema.actionName.required().error(new Error('The action name is required')),
                    useWebhook: ActionSchema.useWebhook.required().error(new Error('Please specify if this action use a webhook for fulfilment.')),
                    usePostFormat: ActionSchema.usePostFormat.required().error(new Error('Please specify if this action use a post format for fulfilment.')),
                    responses: Joi.array().items({
                        textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
                        actions: ActionResponseSchema.actions
                    }).required().min(1).error(new Error('Please specify at least one response.')),
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        uiColor: SlotSchema.uiColor.required(),
                        keywordId: SlotSchema.keywordId,
                        keyword: SlotSchema.keyword,
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        textPrompts: SlotSchema.textPrompts
                    })
                };
            })()
        };

        this.updateAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    actionName: ActionSchema.actionName,
                    useWebhook: ActionSchema.useWebhook,
                    usePostFormat: ActionSchema.usePostFormat,
                    responses: Joi.array().items({
                        textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
                        actions: ActionResponseSchema.actions
                    }).min(1).error(new Error('Please specify at least one response.')),
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        uiColor: SlotSchema.uiColor.required(),
                        keywordId: SlotSchema.keywordId,
                        keyword: SlotSchema.keyword,
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        textPrompts: SlotSchema.textPrompts
                    }),
                    creationDate: ActionSchema.creationDate,
                    modificationDate: ActionSchema.modificationDate
                };
            })()
        };

        this.createKeyword = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    keywordName: KeywordSchema.keywordName.required(),
                    uiColor: KeywordSchema.uiColor,
                    regex: KeywordSchema.regex.allow('').allow(null),
                    type: KeywordSchema.type.allow('').allow(null).valid('learned', 'regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
                    examples: Joi.array().items({
                        value: KeywordExampledSchema.value.required(),
                        synonyms: KeywordExampledSchema.synonyms.required()
                    }).min(1).required()
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
                    fallbackResponses: AgentSchema.fallbackResponses.min(1).error(new Error('please add at least one fallback response for the agent')),
                    status: AgentSchema.status,
                    lastTraining: AgentSchema.lastTraining.allow(''),
                    extraTrainingData: AgentSchema.extraTrainingData,
                    enableModelsPerCategory: AgentSchema.enableModelsPerCategory,
                    model: AgentSchema.model.allow(''),
                    categoryRecognizer: AgentSchema.categoryRecognizer,
                    creationDate: AgentSchema.creationDate,
                    modificationDate: AgentSchema.modificationDate
                };
            })()
        };

        this.addPostFormat = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookHeaders: Joi.array().items({
                        key: Joi.string(),
                        value: Joi.string()
                    }),
                    webhookUser: WebhookSchema.webhookUser,
                    webhookPassword: WebhookSchema.webhookPassword
                };
            })()
        };

        this.updateWebhook = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl,
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookHeaders: Joi.array().items({
                        key: Joi.string(),
                        value: Joi.string()
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookHeaders: Joi.array().items({
                        key: Joi.string(),
                        value: Joi.string()
                    }),
                    webhookUser: WebhookSchema.webhookUser,
                    webhookPassword: WebhookSchema.webhookPassword
                };
            })()
        };

        this.updateWebhookInAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl,
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookHeaders: Joi.array().items({
                        key: Joi.string(),
                        value: Joi.string()
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.removeWebhookInAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.removePostFormat = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };
        this.removePostFormatInAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };
        this.addPostFormatInAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')

                };
            })(),
            query: (() => {

                return {
                    loadCategoryId: Joi.boolean().default(false),
                    [PARAM_SKIP]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to skip. Default=0'),
                    [PARAM_LIMIT]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to return. Default=50'),
                    [PARAM_DIRECTION]: Joi
                        .string()
                        .optional()
                        .allow(SORT_ASC, SORT_DESC)
                        .description('Sort direction. Default= ASC'),
                    [PARAM_FIELD]: Joi
                        .string()
                        .optional()
                        .description('Field used to do the sorting')
                };
            })()
        };

        this.findAllDocuments = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')

                };
            })(),
            query: (() => {

                return {
                    [PARAM_SKIP]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to skip. Default=0'),
                    [PARAM_LIMIT]: Joi
                        .number()
                        .integer()
                        .optional()
                        .description('Number of resources to return. Default=50'),
                    [PARAM_DIRECTION]: Joi
                        .string()
                        .optional()
                        .allow(SORT_ASC, SORT_DESC)
                        .description('Sort direction. Default= ASC')
                };
            })()
        };

        this.findAllSettings = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')

                };
            })()
        };
        this.findSettingByName = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_NAME]: SettingsSchema
                        .name
                        .required()
                        .allow(CONFIG_SETTINGS_DEFAULT_AGENT)
                        .description('Setting name')
                };
            })()
        };

        this.updateAllSettings = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                const keys = {};
                CONFIG_SETTINGS_DEFAULT_AGENT.forEach((key) => {

                    keys[key] = SettingsSchema
                        .value
                        .optional();
                });
                return Joi.object().keys(keys);
            })()
        };

        this.updateSayingInCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category'),
                    [PARAM_SAYING_ID]: SayingSchema.id.required().description('Id of the saying')
                };
            })(),
            payload: (() => {

                return {
                    userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                    keywords: Joi.array().items({
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
                };
            })(),
            payload: (() => {

                return {
                    userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                    keywords: Joi.array().items({
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
                };
            })(),
            payload: (() => {

                return {
                    keywordName: KeywordSchema.keywordName,
                    uiColor: KeywordSchema.uiColor,
                    regex: KeywordSchema.regex.allow('').allow(null),
                    type: KeywordSchema.type
                        .allow('')
                        .allow(null)
                        .valid(CONFIG_KEYWORD_TYPE_LEARNED, CONFIG_KEYWORD_TYPE_REGEX)
                        .optional()
                        .default(CONFIG_KEYWORD_TYPE_LEARNED)
                        .error(new Error('Please provide valid keyword type among learned and regex')),
                    examples: Joi.array().items({
                        value: KeywordExampledSchema.value.required(),
                        synonyms: KeywordExampledSchema.synonyms.required()
                    }),
                    creationDate: KeywordSchema.creationDate,
                    modificationDate: KeywordSchema.modificationDate
                };
            })()
        };

        this.updateCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
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
                    modificationDate: CategorySchema.modificationDate
                };
            })()
        };

        this.trainCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
                };
            })()
        };
        this.train = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.converse = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    [PARAM_SESSION]: Joi.string().required().description('Id of the session'),
                    [PARAM_TEXT]: Joi.string().required().description('Text to parse'),
                    [PARAM_TIMEZONE]: Joi.string().description('Timezone for duckling parse. Default UTC')
                };
            })(),
            query: (() => {

                return {
                    [PARAM_DEBUG]: Joi.boolean().optional().default(false)
                };
            })(),
            options: {
                allowUnknown: true
            }
        };

        this.removeAction = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_ACTION_ID]: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.removeSayingInCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category'),
                    [PARAM_SAYING_ID]: SayingSchema.id.description('Id of the saying')
                };
            })()
        };

        this.removeCategory = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_CATEGORY_ID]: CategorySchema.id.required().description('Id of the category')
                };
            })()
        };

        this.removeKeyword = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_KEYWORD_ID]: KeywordSchema.id.required().description('Id of the keyword')
                };
            })()
        };

        this.export = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
                    fallbackResponses: AgentSchema.fallbackResponses.required(),
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
                    webhook: {
                        webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                        webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                        webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                        webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                        webhookHeaders: Joi.array().items({
                            key: Joi.string(),
                            value: Joi.string()
                        }),
                        webhookUser: WebhookSchema.webhookUser,
                        webhookPassword: WebhookSchema.webhookPassword
                    },
                    settings: Joi.object(),
                    keywords: Joi.array().items({
                        keywordName: KeywordSchema.keywordName.required(),
                        uiColor: KeywordSchema.uiColor,
                        type: KeywordSchema.type.allow('').allow(null).valid('learned', 'regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
                        regex: KeywordSchema.regex.allow('').allow(null),
                        examples: Joi.array().items({
                            value: KeywordExampledSchema.value.required(),
                            synonyms: KeywordExampledSchema.synonyms
                        }).required()
                    }),
                    categories: Joi.array().items({
                        categoryName: CategorySchema.categoryName.required(),
                        enabled: CategorySchema.enabled.required(),
                        actionThreshold: CategorySchema.actionThreshold.required(),
                        model: CategorySchema.model,
                        status: CategorySchema.status,
                        lastTraining: CategorySchema.lastTraining,
                        extraTrainingData: CategorySchema.extraTrainingData,
                        sayings: Joi.array().items({
                            userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                            actions: SayingSchema.actions.allow([]),
                            keywords: Joi.array().items({
                                keywordId: KeywordSchema.id.required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
                                value: SayingKeywordSchema.value.required().error(new Error('You must specify the value that this keyword represents in the user saying')),
                                keyword: SayingKeywordSchema.keyword.required().error(new Error('You must specify the keyword name')),
                                start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                                end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                                extractor: SayingKeywordSchema.extractor
                            }).required().allow([])
                        })
                    }),
                    actions: Joi.array().items({
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
                            webhookHeaders: Joi.array().items({
                                key: Joi.string(),
                                value: Joi.string()
                            }),
                            webhookUser: WebhookSchema.webhookUser,
                            webhookPassword: WebhookSchema.webhookPassword
                        },
                        responses: Joi.array().items({
                            textResponse: ActionResponseSchema.textResponse.required().error(new Error('Please specify the text response for each response')),
                            actions: ActionResponseSchema.actions
                        }).required().min(1).error(new Error('Please specify at least one response.')),
                        slots: Joi.array().items({
                            slotName: SlotSchema.slotName.required(),
                            uiColor: SlotSchema.uiColor.required(),
                            keywordId: SlotSchema.keywordId,
                            keyword: SlotSchema.keyword,
                            isList: SlotSchema.isList.required(),
                            isRequired: SlotSchema.isRequired.required(),
                            textPrompts: SlotSchema.textPrompts
                        })
                    })
                };
            })()
        };

        this.parseGet = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
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
