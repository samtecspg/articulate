'use strict';

const Joi = require('joi');
const IntentSchema = require('../../../models/index').Intent.schema;
const ScenarioSchema = require('../../../models/index').Scenario.schema;
const SlotSchema = require('../../../models/index').Slot.schema;

class IntentValidate {
    constructor() {

        this.add = {
            payload: (() => {

                return {
                    agent: IntentSchema.agent.required(),
                    domain: IntentSchema.domain.required(),
                    intentName: IntentSchema.intentName.required(),
                    examples: IntentSchema.examples.required()
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
                    examples: IntentSchema.examples
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
                    agent: ScenarioSchema.agent.required(),
                    domain: ScenarioSchema.domain.required(),
                    intent: ScenarioSchema.intent.required(),
                    scenarioName: ScenarioSchema.scenarioName.required(),
                    slots: Joi.array().items({
                        slotName: SlotSchema.slotName.required(),
                        entity: SlotSchema.entity.required(),
                        isList: SlotSchema.isList.required(),
                        isRequired: SlotSchema.isRequired.required(),
                        useOriginal: SlotSchema.useOriginal.required(),
                        textPrompts: SlotSchema.textPrompts,
                        useWebhook: SlotSchema.useWebhook.required()
                    }),
                    intentResponses: ScenarioSchema.intentResponses.required(),
                    useWebhook: ScenarioSchema.useWebhook.required(),
                    webhookUrl: ScenarioSchema.webhookUrl
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
                        useOriginal: SlotSchema.useOriginal.required(),
                        textPrompts: SlotSchema.textPrompts,
                        useWebhook: SlotSchema.useWebhook.required()
                    }),
                    intentResponses: ScenarioSchema.intentResponses,
                    useWebhook: ScenarioSchema.useWebhook,
                    webhookUrl: ScenarioSchema.webhookUrl
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

    }
}

const intentValidate = new IntentValidate();
module.exports = intentValidate;
