'use strict';

const Joi = require('joi');
class AgentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agentName: Joi.string().trim(),
            description: Joi.string().trim(),
            language: Joi.string().trim(),
            timezone: Joi.string().trim(),
            useWebhook: Joi.boolean(),
            domainClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string().trim())
        };
    };
}

module.exports = AgentModel;
