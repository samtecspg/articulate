'use strict';

const Joi = require('joi');
class EntityUserSayingModel {
    static get schema() {

        return {
            value: Joi.string(),
            entity: Joi.string(),
            start: Joi.number(),
            end: Joi.number()
        };
    };
}

module.exports = EntityUserSayingModel;
