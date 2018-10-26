'use strict';
const AgentSchema = require('../../../models/index').Agent.schema;
const EntitySchema = require('../../../models/index').Entity.schema;
const ExampleSchema = require('../../../models/index').Example.schema;
const DomainSchema = require('../../../models/index').Domain.schema;
const IntentSchema = require('../../../models/index').Intent.schema;
const IntentExampleSchema = require('../../../models/index').IntentExample.schema;
const IntentEntitySchema = require('../../../models/index').IntentEntity.schema;
const WebhookSchema = require('../../../models/index').Webhook.schema;
const ScenarioSchema = require('../../../models/index').Scenario.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
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

        this.findEntitiesByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those entities with part of this filter in their names')
                };
            })()
        };

        this.findEntityByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    entityId: EntitySchema.id.required().description('Id of the entity')
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

        this.findIntentsInDomainByIdByAgentId = {
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
                    filter: Joi.string().description('String that will filter values to return only those intents with part of this filter in their names')
                };
            })()
        };

        this.findIntentByIdInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain'),
                    intentId: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.findIntentScenarioInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain'),
                    intentId: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.findIntentWebhookInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain'),
                    intentId: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };


        this.findIntentPostFormatInDomainByIdByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent'),
                    domainId: DomainSchema.id.required().description('Id of the domain'),
                    intentId: IntentSchema.id.required().description('Id of the intent')
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
                        webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                        webhookUsername: WebhookSchema.webhookUsername.allow('').optional(),
                        webhookPassword: WebhookSchema.webhookPassword.allow('').optional()
                    },
                    settings: Joi.object(),
                    entities: Joi.array().items({
                        entityName: EntitySchema.entityName.required(),
                        uiColor: EntitySchema.uiColor,
                        type: EntitySchema.type.allow('').allow(null).valid('learned','regex').optional().default('learned').error(new Error('Please provide valid entity type among learned and regex')),
                        regex: EntitySchema.regex.allow('').allow(null),
                        examples: Joi.array().items({
                            value: ExampleSchema.value.required(),
                            synonyms: ExampleSchema.synonyms
                        }).required()
                    }),
                    domains: Joi.array().items({
                        domainName: DomainSchema.domainName.required(),
                        enabled: DomainSchema.enabled.required(),
                        intentThreshold: DomainSchema.intentThreshold.required(),
                        lastTraining: DomainSchema.lastTraining,
                        model: DomainSchema.model,
                        status: DomainSchema.status,
                        lastTraining: DomainSchema.lastTraining,
                        extraTrainingData: DomainSchema.extraTrainingData,
                        intents: Joi.array().items({
                            intentName: IntentSchema.intentName.required(),
                            examples: Joi.array().items({
                                userSays: IntentExampleSchema.userSays.required().error(new Error('The user says text is required')),
                                entities: Joi.array().items({
                                    start: IntentEntitySchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                                    end: IntentEntitySchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                                    value: IntentEntitySchema.value.required().error(new Error('The parsed value is required.')),
                                    entity: IntentEntitySchema.entity.required().error(new Error('The entity reference is required.')),
                                    extractor: IntentEntitySchema.extractor
                                }).required().allow([])
                            }).required().min(2).error(new Error('Please specify at least two examples for your intent definition.')),
                            scenario: {
                                scenarioName: ScenarioSchema.scenarioName.required(),
                                slots: Joi.array().items({
                                    slotName: SlotSchema.slotName.required(),
                                    entity: SlotSchema.entity.required(),
                                    isList: SlotSchema.isList.required(),
                                    isRequired: SlotSchema.isRequired.required(),
                                    textPrompts: SlotSchema.textPrompts
                                }),
                                intentResponses: ScenarioSchema.intentResponses.required()
                            },
                            useWebhook: IntentSchema.useWebhook.required(),
                            webhook: {
                                webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                                webhookVerb: WebhookSchema.webhookVerb.valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').required().error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                                webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML').required().error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML.')),
                                webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                                webhookUsername: WebhookSchema.webhookUsername.allow('').optional(),
                                webhookPassword: WebhookSchema.webhookPassword.allow('').optional()
                            },

                            usePostFormat: IntentSchema.usePostFormat.required(),
                            postFormat: {
                                postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
                            }
                        })
                    })
                };
            })()
        };

        this.findIntentsByAgentId = {
            params: (() => {

                return {
                    id: AgentSchema.id.required().description('Id of the agent')
                };
            })(),
            query: (() => {

                return {
                    start: Joi.number().description('The index of the first element to return. 0 is the default start.'),
                    limit: Joi.number().description('Number of elements to return from start. All the elements are returned by default'),
                    filter: Joi.string().description('String that will filter values to return only those intents with part of this filter in their names')
                };
            })()
        };

        this.addWebhook = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agent: ScenarioSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the webhook.')),
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
                    id: IntentSchema.id.required().description('Id of the agent')
                };
            })(),
            payload: (() => {

                return {
                    agent: ScenarioSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the webhook.')),
                    postFormatPayload: PostFormatSchema.postFormatPayload.required(),
                    id : Joi.any().allow('').optional()
                };
            })()
        };

        this.findPostFormat = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the agent')
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
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.updateWebhook = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
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
    }
}

const agentValidate = new AgentValidate();
module.exports = agentValidate;
