'use strict';

const Joi = require('joi');

class IntentEntityModel {
    static get schema() {

        return {
            start: Joi.number(),
            end: Joi.number(),
            value: Joi.string().trim(),
            entity: Joi.string().trim(),
            entityId: Joi.number(),
            extractor: Joi.string().trim()
        };
    };
}

module.exports = IntentEntityModel;
