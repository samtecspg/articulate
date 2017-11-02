'use strict';

const Joi = require('joi');
class AgentModel {
    static get schema() {

        return {
            id: Joi.number(),
            agentName: Joi.string(),
            webhookUrl: Joi.string(),
            domainClassifierThreshold: Joi.number(),
            fallbackResponses: Joi.array().items(Joi.string()),
            useWebhookFallback: Joi.boolean()
        };
    };
}

module.exports = AgentModel;
