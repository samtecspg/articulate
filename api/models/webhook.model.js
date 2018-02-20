'use strict';

const Joi = require('joi');

class WebhookModel {
    static get schema() {

        return {
            id: Joi.string(),
            webhookUrl: Joi.string(),
            webhookVerb: Joi.string(),
            webhookPayloadType: Joi.string(),
            webhookPayload: Joi.string()
        };
    };
}

module.exports = WebhookModel;
