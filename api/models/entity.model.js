'use strict';

const Joi = require('joi');
const ExampleModel = require('./example.entity.model');
class EntityModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string(),
            entityName: Joi.string(),
            usedBy: Joi.array().items(Joi.number()),
            examples: Joi.array().items(ExampleModel.schema)
        };
    };
}

module.exports = EntityModel;
