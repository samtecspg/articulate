'use strict';

const Joi = require('joi');
const UserSayingModel = require('./userSaying.intent.model');
class IntentModel {
    static get schema() {

        return {
            _id: Joi.string(),
            agent: Joi.string(),
            domain: Joi.string(),
            intentName: Joi.string(),
            examples: Joi.array().items(UserSayingModel.schema)
        };
    };
}

module.exports = IntentModel;
