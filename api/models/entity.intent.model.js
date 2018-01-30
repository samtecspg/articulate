'use strict';

const Joi = require('joi');
class IntentEntityModel {
    static get schema() {

        return {
            start: Joi.number(),
            end: Joi.number(),
            value: Joi.string(),
            entity: Joi.string()
        };
    };
}

module.exports = IntentEntityModel;
