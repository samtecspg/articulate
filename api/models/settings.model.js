'use strict';

const Joi = require('joi');

class SettingsModel {
    static get schema() {

        return {
            uiLanguage: Joi.string(),
            domainClassifierPipeline: Joi.array().items({
                name: Joi.string()
            }),
            intentClassifierPipeline: Joi.array().items({
                name: Joi.string()
            }),
            entityClassifierPipeline: Joi.array().items({
                name: Joi.string()
            })
        };
    };
}

module.exports = SettingsModel;
