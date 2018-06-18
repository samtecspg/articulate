'use strict';

const Joi = require('joi');
const SlotModel = require('./slot.scenario.model');
class ScenarioModel {
    static get schema() {

        return {
            id: Joi.string().trim(),
            agent: Joi.string().trim(),
            domain: Joi.string().trim(),
            intent: Joi.string().trim(),
            scenarioName: Joi.string().trim(),
            slots: Joi.array().items(SlotModel.schema),
            intentResponses: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = ScenarioModel;
