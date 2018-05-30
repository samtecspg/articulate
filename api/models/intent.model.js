'use strict';

const Joi = require('joi');
const ExampleIntentModel = require('./example.intent.model');

class IntentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string().trim(),
            domain: Joi.string().trim(),
            intentName: Joi.string().trim(),
            examples: Joi.array().items(ExampleIntentModel.schema),
            useWebhook: Joi.boolean(),
            usePostFormat: Joi.boolean()
        };
    };
}

module.exports = IntentModel;
