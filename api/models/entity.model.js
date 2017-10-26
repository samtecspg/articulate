'use strict';

const Joi = require('joi');
const ExampleModel = require('./example.entity.model');
class EntityModel {
    static get schema() {

        return {
            _id: Joi.string(),
            agent: Joi.string(),
            entityName: Joi.string(),
            usedBy: Joi.array().items(Joi.string()),
            examples: Joi.array().items(ExampleModel.schema)
        };
    };
}

module.exports = EntityModel;
