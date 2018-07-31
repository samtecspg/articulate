'use strict';

const Joi = require('joi');
class ExampleModel {
    static get schema() {

        return {
            value: Joi.string().trim(),
            synonyms: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = ExampleModel;
