'use strict';

const Joi = require('joi');

class SettingsModel {
    static get schema() {

        return {
            uiLanguage: Joi.string().trim(),
            domainClassifierPipeline: Joi.array().items({
                name: Joi.string().trim()
            }),
            intentClassifierPipeline: Joi.array().items({
                name: Joi.string().trim()
            }),
            entityClassifierPipeline: Joi.array().items({
                name: Joi.string().trim()
            })
        };
    };
}

module.exports = SettingsModel;
