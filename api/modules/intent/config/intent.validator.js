'use strict';

const Joi = require('joi');
const IntentSchema = require('../../../models/index').Intent.schema;
const ScenarioSchema = require('../../../models/index').Scenario.schema;
const WebhookSchema = require('../../../models/index').Webhook.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const IntentEntitySchema = require('../../../models/index').IntentEntity.schema;
const IntentExampleSchema = require('../../../models/index').IntentExample.schema;
const PostFormatSchema = require('../../../models/index').PostFormat.schema;

class IntentValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the intent.')),
                    domain: IntentSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the intent')),
                    intentName: IntentSchema.intentName.required().error(new Error('The intent name is required')),
                    useWebhook: IntentSchema.useWebhook.required().error(new Error('Please specify if this intent use a webhook for fullfilment.')),
                    usePostFormat: IntentSchema.usePostFormat.required().error(new Error('Please specify if this intent use a post format for fullfilment.')),
                    examples: Joi.array().items({
                        userSays: IntentExampleSchema.userSays.required().error(new Error('The user says text is required')),
                        entities: Joi.array().items({
                            entityId: Joi.number().required().error(new Error('You must specify the id of the entity that you are tagging in the examples')),
                            start: IntentEntitySchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                            end: IntentEntitySchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                            value: IntentEntitySchema.value.required().error(new Error('The parsed value is required.')),
                            entity: IntentEntitySchema.entity.required().error(new Error('The entity reference is required.')),
                            extractor: IntentEntitySchema.extractor
                        }).required().allow([])
                    }).required().min(2)
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    intentName: IntentSchema.intentName,
                    useWebhook: IntentSchema.useWebhook,
                    usePostFormat: IntentSchema.usePostFormat,
                    examples: Joi.array().items({
                        userSays: IntentExampleSchema.userSays.required().error(new Error('The user says text is required')),
                        entities: Joi.array().items({
                            entityId: Joi.number(),
                            start: IntentEntitySchema.start.required().error(new Error('The start value should be an integer and it is required for all entities.')),
                            end: IntentEntitySchema.end.required().error(new Error('The end value should be an integer and it is required for all entities.')),
                            value: IntentEntitySchema.value.required().error(new Error('The value is required for all entities.')),
                            entity: IntentEntitySchema.entity.required().error(new Error('The entity reference is required for all entities in examples.')),
                            extractor: IntentEntitySchema.extractor
                        }).required().allow([])
                    }).min(2)
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.addScenario = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    agent: ScenarioSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the scenario.')),
                    domain: ScenarioSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the scenario.')),
                    intent: ScenarioSchema.intent.required().error(new Error('The intent is required. Please specify an intent for the scenario.')),
                    scenarioName: ScenarioSchema.scenarioName.required().error(new Error('The name is required. Please specify a name for the scenario.')),
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required().error(new Error('The slot name is required.')),
                        entity: SlotSchema.entity.required().error(new Error('The entity is required for the slot.')),
                        isList: SlotSchema.isList.required().error(new Error('Please specify if the slot is a list of items or not.')),
                        isRequired: SlotSchema.isRequired.required().error(new Error('Please specify if the slot is required or not.')),
                        textPrompts: SlotSchema.textPrompts
                    }),
                    intentResponses: ScenarioSchema.intentResponses
                };
            })()
        };

        this.findScenario = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.updateScenario = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    scenarioName: ScenarioSchema.scenarioName,
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        entity: SlotSchema.entity.required(),
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        textPrompts: SlotSchema.textPrompts
                    }),
                    intentResponses: ScenarioSchema.intentResponses
                };
            })()
        };

        this.deleteScenario = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.addWebhook = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    agent: ScenarioSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the scenario.')),
                    domain: ScenarioSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the scenario.')),
                    intent: ScenarioSchema.intent.required().error(new Error('The intent is required. Please specify an intent for the scenario.')),
                    webhookUrl: WebhookSchema.webhookUrl.required().error(new Error('The url is required. Please specify an url for the webhook.')),
                    webhookVerb: WebhookSchema.webhookVerb.required().valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH').error(new Error('Please provide a valid verb for the webhook. Supported verbs are: GET, PUT, POST, DELETE, PATCH.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.required().valid('None', 'JSON', 'XML', 'URL Encoded').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML, and URL Encoded.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookUsername: WebhookSchema.webhookUsername.allow('').optional(),
                    webhookPassword: WebhookSchema.webhookPassword.allow('').optional()
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
                    webhookPayloadType: WebhookSchema.webhookPayloadType.valid('None', 'JSON', 'XML', 'URL Encoded').error(new Error('Please provide a valid payload type for the webhook. Supported types are: None, JSON, XML, and URL Encoded.')),
                    webhookPayload: WebhookSchema.webhookPayload.allow('').optional(),
                    webhookUsername: WebhookSchema.webhookUsername.allow('').optional(),
                    webhookPassword: WebhookSchema.webhookPassword.allow('').optional()
                };
            })()
        };

        this.deleteWebhook = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };


        this.addPostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    agent: ScenarioSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the post format.')),
                    domain: ScenarioSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the post format.')),
                    intent: ScenarioSchema.intent.required().error(new Error('The intent is required. Please specify an intent for the post format.')),
                    postFormatPayload: PostFormatSchema.postFormatPayload.allow('').required()
                };
            })()
        };

        this.findPostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the intent')
                };
            })()
        };

        this.updatePostFormat = {
            params: (() => {

                return {
                    id: PostFormatSchema.id.required().description('Id of the intent')
                };
            })(),
            payload: (() => {

                return {
                    postFormatPayload: PostFormatSchema.postFormatPayload.allow('').optional()
                };
            })()
        };

        this.deletePostFormat = {
            params: (() => {

                return {
                    id: IntentSchema.id.required().description('Id of the intent')
                };
            })()
        };
    }
}

const intentValidate = new IntentValidate();
module.exports = intentValidate;
