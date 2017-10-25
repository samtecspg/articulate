'use strict';

const Joi = require('joi');
class AgentModel {
    static get schema() {

        return {
            _id: Joi.string(),
            agentName: Joi.string(),
            webhookUrl: Joi.string(),
            domainClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string()),
            useWebhookFallback: Joi.boolean(),
            webhookFallbackUrl: Joi.string()
        };
    };
}

module.exports = AgentModel;
