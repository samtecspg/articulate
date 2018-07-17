'use strict';
const AgentSchema = require('../../../models/index').Agent.schema;
const KeywordSchema = require('../../../models/index').Keyword.schema;
const ExampleSchema = require('../../../models/index').Example.schema;
const DomainSchema = require('../../../models/index').Domain.schema;
const ActionSchema = require('../../../models/index').Action.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const SayingSchema = require('../../../models/index').Saying.schema;
const SayingKeywordSchema = require('../../../models/index').SayingKeyword.schema;
const WebhookSchema = require('../../../models/index').Webhook.schema;
const PostFormatSchema = require('../../../models/index').PostFormat.schema;
const Joi = require('joi');

class AgentValidate {
    constructor() {

        this.findAll = {
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default')
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.findByName = {
            params: (() => {

                return {
                    agentName: AgentSchema.agentName.required().description('The name of the agent')
                };
            })()
        };

        this.findKeywordsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those keywords with part of this filter in their names')
                };
            })()
        };

        this.findKeywordByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    keywordId: KeywordSchema.id.required().description('Id of the keyword')
                };
            })()
        };

        this.findDomainsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those domains with part of this filter in their names')
                };
            })()
        };

        this.findDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain')
                };
            })()
        };

        this.findActionsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those actions with part of this filter in their names')
                };
            })()
        };

        this.findActionByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    actionId: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.findSayingsInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those sayings with part of this filter in their names')
                };
            })()
        };

        this.findSayingByIdInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain'),
                    sayingId: SayingSchema.id.required().description('Id of the saying')
                };
            })()
        };

        this.findActionWebhookByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    actionId: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };


        this.findActionPostFormatByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    actionId: ActionSchema.id.required().description('Id of the action')
                };
            })()
        };

        this.add = {
            payload: (() => {

                return {
                    agentName: AgentSchema.agentName.required(),
                    description: AgentSchema.description,
                    language: AgentSchema.language.valid('en', 'es', 'de', 'fr', 'pt').required().error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
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

        this.updateById = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agentName: AgentSchema.agentName,
                    description: AgentSchema.description,
                    language: AgentSchema.language.valid('en', 'es', 'de', 'fr', 'pt').error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
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
                    model: AgentSchema.model
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.parse = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default UTC')
                };
            })()
        };

        this.parsePost = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default UTC')
                };
            })()
        };

        this.converse = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session'),
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default UTC')
                };
            })()
        };

        this.conversePost = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    sessionId: Joi.string().required().description('Id of the session'),
                    text: Joi.string().required().description('Text to parse'),
                    timezone: Joi.string().description('Timezone for duckling parse. Default UTC')
                };
            })(),
            options: {
                allowUnknown: true
            }
        };

        this.export = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    withReferences: Joi.bool().default(false).description('Flag to indicate if method should exports ids and ancestors of an element')
                };
            })()
        };

        this.import = {
            payload: (() => {

                return {
                    agentName: AgentSchema.agentName.required(),
                    description: AgentSchema.description,
                    language: AgentSchema.language.required().valid('en', 'es', 'de', 'fr', 'pt').error(new Error('Please provide a valid language for the agent. Supported languages are: en, es, de, fr')),
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
                        type: KeywordSchema.type.allow('').allow(null).valid('learned','regex').optional().default('learned').error(new Error('Please provide valid keyword type among learned and regex')),
                        regex: KeywordSchema.regex.allow('').allow(null),
                        examples: Joi.array().items({
                            value: ExampleSchema.value.required(),
                            synonyms: ExampleSchema.synonyms
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
                                start: SayingKeywordSchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                                end: SayingKeywordSchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                                value: SayingKeywordSchema.value.required().error(new Error('The parsed value is required.')),
                                keyword: SayingKeywordSchema.keyword.required().error(new Error('The keyword reference is required.')),
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
                            webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                            webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                            webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                        },
                        responses: ActionSchema.responses.required().min(1).error(new Error('Please specify at least one response.')),
                        slots: Joi.array().items({
                            slotName: SlotSchema.slotName.required(),
                            uiColor: SlotSchema.uiColor.required(),
                            keyword: SlotSchema.keyword,
                            isList: SlotSchema.isList.required(),
                            isRequired: SlotSchema.isRequired.required(),
                            textPrompts: SlotSchema.textPrompts
                        })
                    })
                };
            })()
        };

        this.findSayingsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those sayings with part of this filter in their names')
                };
            })()
        };

        this.addWebhook = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agent: AgentSchema.agentName.required().error(new Error('The agent is required. Please specify an agent for the webhook.')),
                    webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                };
            })()
        };

        this.addPostFormat = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agent: AgentSchema.agentName.required().error(new Error('The agent is required. Please specify an agent for the webhook.')),
                    postFormatPayload: PostFormatSchema.postFormatPayload.required(),
                    id : Joi.any().allow('').optional()
                };
            })()
        };

        this.findPostFormat = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.updatePostFormat = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
                };
            })()
        };
        this.deletePostFormat = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };


        this.findWebhook = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the saying')
                };
            })()
        };

        this.updateWebhook = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the saying')
                };
            })(),
            payload: (() => {

                return {
                    webhookUrl: WebhookSchema.webhookUrl,
                    webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional()
                };
            })()
        };

        this.deleteWebhook = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.train = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })()
        };

        this.updateSettings = {
            params: (() => {

                return {
                    id: Joi.string().required().description('The id of the agent')
                };
            })(),
            payload: (() => {

                return Joi.object();
            })()
        };

        this.findAllSettings = {
            params: (() => {

                return {
                    id: Joi.string().required().description('The id of the agent')
                };
            })()
        };

        this.findSettingsByName = {
            params: (() => {

                return {
                    id: Joi.string().required().description('The id of the agent'),
                    name: Joi.string().required().description('The name of the setting')
                };
            })()
        };

        this.convert = {
            payload: (() => {

                return Joi.object();
            })()
        };
    }
}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
