import Joi from 'joi';
import {
    CONFIG_KEYWORD_TYPE_LEARNED,
    CONFIG_KEYWORD_TYPE_REGEX,
    CONFIG_SETTINGS_DEFAULT_AGENT,
    PARAM_ACTION_ID,
    PARAM_AGENT_ID,
    PARAM_DIRECTION,
    PARAM_DOMAIN_ID,
    PARAM_FIELD,
    PARAM_KEYWORD_ID,
    PARAM_LIMIT,
    PARAM_NAME,
    PARAM_SAYING_ID,
    PARAM_SESSION,
    PARAM_SKIP,
    PARAM_TEXT,
    PARAM_TIMEZONE
} from '../../util/constants';

const AgentSchema = require('../models/agent.model').schema;
const DomainSchema = require('../models/domain.model').schema;
const ActionSchema = require('../models/action.model').schema;
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

        this.findAllDomain = {
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
                    language: AgentSchema.language.required().error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
                    timezone: AgentSchema.timezone.required(),
                    useWebhook: AgentSchema.useWebhook.required(),
                    usePostFormat: AgentSchema.usePostFormat.required(),
                    multiDomain: AgentSchema.multiDomain.required(),
                    domainClassifierThreshold: AgentSchema.domainClassifierThreshold.required(),
                    fallbackResponses: AgentSchema.fallbackResponses.required().min(1).error(new Error('please add at least one fallback response for the agent')),
                    extraTrainingData: AgentSchema.extraTrainingData,
                    enableModelsPerDomain: AgentSchema.enableModelsPerDomain
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

        this.createDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    domainName: DomainSchema.domainName.required(),
                    enabled: DomainSchema.enabled.required(),
                    actionThreshold: DomainSchema.actionThreshold.required(),
                    lastTraining: DomainSchema.lastTraining,
                    model: DomainSchema.model,
                    extraTrainingData: DomainSchema.extraTrainingData
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
                    responses: ActionSchema.responses.required().min(1).error(new Error('Please specify at least one response.')),
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
                    actionName: ActionSchema.actionName.required().error(new Error('The action name is required')),
                    useWebhook: ActionSchema.useWebhook.required().error(new Error('Please specify if this action use a webhook for fulfilment.')),
                    usePostFormat: ActionSchema.usePostFormat.required().error(new Error('Please specify if this action use a post format for fulfilment.')),
                    responses: ActionSchema.responses.required().min(1).error(new Error('Please specify at least one response.')),
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
                    language: AgentSchema.language.error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
                    timezone: AgentSchema.timezone,
                    useWebhook: AgentSchema.useWebhook,
                    usePostFormat: AgentSchema.usePostFormat,
                    multiDomain: AgentSchema.multiDomain,
                    domainClassifierThreshold: AgentSchema.domainClassifierThreshold,
                    fallbackResponses: AgentSchema.fallbackResponses.min(1).error(new Error('please add at least one fallback response for the agent')),
                    status: AgentSchema.status,
                    lastTraining: AgentSchema.lastTraining,
                    extraTrainingData: AgentSchema.extraTrainingData,
                    enableModelsPerDomain: AgentSchema.enableModelsPerDomain,
                    model: AgentSchema.model,
                    domainRecognizer: AgentSchema.domainRecognizer
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
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
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
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
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
                    loadDomainId: Joi.boolean().default(false),
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
                        .allow('ASC', 'DESC')
                        .description('Sort direction. Default= ASC'),
                    [PARAM_FIELD]: Joi
                        .string()
                        .optional()
                        .description('Field used to do the sorting')
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

        this.updateSayingInDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain'),
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
                    actions: SayingSchema.actions.allow([])
                };
            })()
        };
        this.createSayingInDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain')
                };
            })(),
            payload: (() => {

                return {
                    userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                    keywords: Joi.array().items({
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
                    })
                };
            })()
        };

        this.updateDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain')
                };
            })(),
            payload: (() => {

                return {
                    actionThreshold: DomainSchema.actionThreshold,
                    domainName: DomainSchema.domainName,
                    enabled: DomainSchema.enabled,
                    extraTrainingData: DomainSchema.extraTrainingData,
                    lastTraining: DomainSchema.lastTraining,
                    model: DomainSchema.model,
                    status: DomainSchema.status
                };
            })()
        };

        this.trainDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain')
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

        this.removeSayingInDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain'),
                    [PARAM_SAYING_ID]: SayingSchema.id.description('Id of the saying')
                };
            })()
        };

        this.removeDomain = {
            params: (() => {

                return {
                    [PARAM_AGENT_ID]: AgentSchema.id.required().description('Id of the agent'),
                    [PARAM_DOMAIN_ID]: DomainSchema.id.required().description('Id of the domain')
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
                    language: AgentSchema.language.required().error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
                    timezone: AgentSchema.timezone.required(),
                    domainClassifierThreshold: AgentSchema.domainClassifierThreshold.required(),
                    fallbackResponses: AgentSchema.fallbackResponses.required(),
                    useWebhook: AgentSchema.useWebhook.required(),
                    multiDomain: AgentSchema.multiDomain.required(),
                    usePostFormat: AgentSchema.usePostFormat.required(),
                    postFormat: {
                        postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
                    },
                    status: AgentSchema.status,
                    lastTraining: AgentSchema.lastTraining,
                    extraTrainingData: AgentSchema.extraTrainingData,
                    enableModelsPerDomain: AgentSchema.enableModelsPerDomain,
                    model: AgentSchema.model,
                    webhook: {
                        webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                        webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                        webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                        webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
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
                    domains: Joi.array().items({
                        domainName: DomainSchema.domainName.required(),
                        enabled: DomainSchema.enabled.required(),
                        actionThreshold: DomainSchema.actionThreshold.required(),
                        model: DomainSchema.model,
                        status: DomainSchema.status,
                        lastTraining: DomainSchema.lastTraining,
                        extraTrainingData: DomainSchema.extraTrainingData,
                        sayings: Joi.array().items({
                            userSays: SayingSchema.userSays.required().error(new Error('The user says text is required')),
                            actions: SayingSchema.actions.allow([]),
                            keywords: Joi.array().items({
                                keywordId: KeywordSchema.id.required().error(new Error('You must specify the id of the keyword that you are tagging in the examples')),
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
                            webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                        },
                        responses: ActionSchema.responses.required().min(1).error(new Error('Please specify at least one response.')),
                        slots: Joi.array().items({
                            slotName: SlotSchema.slotName.required(),
                            uiColor: SlotSchema.uiColor.required(),
                            keywordId: SlotSchema.keywordId,
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
