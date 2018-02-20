'use strict';

const Joi = require('joi');
const IntentSchema = require('../../../models/index').Intent.schema;
const ScenarioSchema = require('../../../models/index').Scenario.schema;
const WebhookSchema = require('../../../models/index').Webhook.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const IntentEntitySchema = require('../../../models/index').IntentEntity.schema;
const IntentExampleSchema = require('../../../models/index').IntentExample.schema;

class IntentValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required().error(new Error('The agent is required. Please specify an agent for the intent.')),
                    domain: IntentSchema.domain.required().error(new Error('The domain is required. Please specify a domain for the intent')),
                    intentName: IntentSchema.intentName.required().error(new Error('The intent name is required')),
                    useWebhook: IntentSchema.useWebhook.required().error(new Error('Please specify if this intent use a webhook for fullfilment.')),
                    examples: Joi.array().items({
                        userSays: IntentExampleSchema.userSays.required().error(new Error('The user says text is required')),
                        entities: Joi.array().items({
                            entityId: Joi.number(),
                            start: IntentEntitySchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                            end: IntentEntitySchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                            value: IntentEntitySchema.value.required().error(new Error('The parsed value is required.')),
                            entity: IntentEntitySchema.entity.required().error(new Error('The entity reference is required.'))
                        })
                    }).required().min(2).error(new Error('Please specify at least two examples for your intent definition.'))
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
                    examples: Joi.array().items({
                        userSays: IntentExampleSchema.userSays.required().error(new Error('The user says text is required')),
                        entities: Joi.array().items({
                            entityId: Joi.number(),
                            start: IntentEntitySchema.start.required().error(new Error('The start value should be an integer and it is required.')),
                            end: IntentEntitySchema.end.required().error(new Error('The end value should be an integer and it is required.')),
                            value: IntentEntitySchema.value.required().error(new Error('The parsed value is required.')),
                            entity: IntentEntitySchema.entity.required().error(new Error('The entity reference is required.'))
                        })
                    }).min(2).error(new Error('Please specify at least two examples for your intent definition.'))
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
                    webhookVerb: WebhookSchema.webhookVerb.required().error(new Error('The verb is required. Please specify a verb for the webhook.')),
                    webhookPayloadType: WebhookSchema.webhookPayloadType.required().error(new Error('The payload type is required. Please specify a payload type for the webhook.')),
                    webhookPayload: WebhookSchema.webhookPayload
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
                    webhookVerb: WebhookSchema.webhookVerb,
                    webhookPayloadType: WebhookSchema.webhookPayloadType,
                    webhookPayload: WebhookSchema.webhookPayload
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

    }
}

const intentValidate = new IntentValidate();
module.exports = intentValidate;
