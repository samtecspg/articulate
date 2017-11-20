'use strict';

const Joi = require('joi');
const SlotModel = require('./slot.scenario.model');
class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string(),
            scenario: Joi.string(),
            slots: Joi.array().items(Joi.object())
        };
    };
}

module.exports = ScenarioModel;
