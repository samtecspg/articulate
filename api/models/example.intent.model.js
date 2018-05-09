'use strict';

const Joi = require('joi');
const IntentEntityModel = require('./entity.intent.model');

class IntentExampleModel {
    static get schema() {

        return {
            id: Joi.number(),
            userSays: Joi.string().trim(),
            entities: Joi.array().items(IntentEntityModel.schema)
        };
    };
}

module.exports = IntentExampleModel;
