'use strict';

const Joi = require('joi');
class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string().trim(),
            scenario: Joi.string().trim(),
            slots: Joi.object().min(1)
        };
    };
}

module.exports = ScenarioModel;
