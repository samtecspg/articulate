'use strict';

const Joi = require('joi');
class DomainModel {
    static get schema() {

        return {
            _id: Joi.string(),
            agent: Joi.string(),
            domainName: Joi.string(),
            enabled: Joi.boolean(),
            intentThreshold: Joi.number(),
            lastTraining: Joi.date()
        };
    };
}

module.exports = DomainModel;
