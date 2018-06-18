'use strict';

const Joi = require('joi');
const ExampleModel = require('./example.entity.model');
class EntityModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string().trim(),
            entityName: Joi.string().trim(),
            uiColor: Joi.string().trim(),
            examples: Joi.array().items(ExampleModel.schema),
            regex : Joi.string().trim(),
            type: Joi.string().trim()
        };
    };
}

module.exports = EntityModel;
