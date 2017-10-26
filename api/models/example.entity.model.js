'use strict';

const Joi = require('joi');
class ExampleModel {
    static get schema() {

        return {
            value: Joi.string(),
            synonyms: Joi.array().items(Joi.string())
        };
    };
}

module.exports = ExampleModel;
