'use strict';

const Joi = require('joi');
const IntentEntityModel = require('./entity.intent.model');

class IntentExampleModel {
    static get schema() {

        return {
            userSays: Joi.string(),
            entities: Joi.array().items(IntentEntityModel.schema)
        };
    };
}

module.exports = IntentExampleModel;
