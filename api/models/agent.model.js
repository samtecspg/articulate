'use strict';

const Joi = require('joi');
class AgentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agentName: Joi.string(),
            description: Joi.string(),
            language: Joi.string(),
            timezone: Joi.string(),
            useWebhook: Joi.boolean(),
            domainClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string())
        };
    };
}

module.exports = AgentModel;
