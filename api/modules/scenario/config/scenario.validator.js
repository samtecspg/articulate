'use strict';

const ScenarioSchema = require('../../../models/index').Scenario.schema;
const SlotSchema = require('../../../models/index').Slot.schema;
const Joi = require('joi');

class ScenarioValidate {
    constructor() {

        this.add = {
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
                        textPrompts: SlotSchema.textPrompts,
                        useWebhook: SlotSchema.useWebhook.required()
                    }),
                    intentResponses: ScenarioSchema.intentResponses.required(),
                    useWebhook: ScenarioSchema.useWebhook.required(),
                    webhookUrl: ScenarioSchema.webhookUrl
                };
            })()
        };

        this.findById = {
            params: (() => {

                return {
                    id: ScenarioSchema._id.required().description('Id of the scenario')
                };
            })()
        };

        this.updateById = {
            params: (() => {

                return {
                    id: ScenarioSchema._id.required().description('Id of the scenario')
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
                        textPrompts: SlotSchema.textPrompts,
                        useWebhook: SlotSchema.useWebhook.required()
                    }),
                    intentResponses: ScenarioSchema.intentResponses,
                    useWebhook: ScenarioSchema.useWebhook,
                    webhookUrl: ScenarioSchema.webhookUrl
                };
            })()
        };

        this.deleteById = {
            params: (() => {

                return {
                    id: ScenarioSchema._id.required().description('Id of the scenario')
                };
            })()
        };

    }
}

const scenarioValidate = new ScenarioValidate();
module.exports = scenarioValidate;
