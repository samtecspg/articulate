'use strict';

const Joi = require('joi');
const ExampleIntentModel = require('./example.intent.model');

class IntentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string(),
            domain: Joi.string(),
            intentName: Joi.string(),
            examples: Joi.array().items(ExampleIntentModel.schema),
            useWebhook: Joi.boolean()
        };
    };
}

module.exports = IntentModel;
