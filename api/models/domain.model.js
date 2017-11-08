'use strict';

const Joi = require('joi');
class DomainModel {
    static get schema() {

        return {
            id: Joi.number(),
            agent: Joi.string(),
            domainName: Joi.string(),
            enabled: Joi.boolean(),
            intentThreshold: Joi.number(),
            lastTraining: Joi.date()
        };
    };
}

module.exports = DomainModel;
