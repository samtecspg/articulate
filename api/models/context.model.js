'use strict';

const Joi = require('joi');
class ScenarioModel {
    static get schema() {

        return {
            id: Joi.number(),
            action: Joi.string().trim(),
            slots: Joi.object()
        };
    };
}

module.exports = ScenarioModel;
