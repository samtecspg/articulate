'use strict';

const Joi = require('joi');
class IntentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string(),
            domain: Joi.string(),
            intentName: Joi.string(),
            examples: Joi.array().items(Joi.string())
        };
    };
}

module.exports = IntentModel;
