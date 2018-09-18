'use strict';

const Joi = require('joi');

class WebhookModel {
    static get schema() {

        return {
            id: Joi.string().trim(),
            webhookUrl: Joi.string().trim(),
            webhookVerb: Joi.string().trim(),
            webhookPayloadType: Joi.string().trim(),
            webhookPayload: Joi.string().trim(),
            webhookUsername: Joi.string().trim(),
            webhookPassword: Joi.string().trim()
        };
    };
}

module.exports = WebhookModel;
