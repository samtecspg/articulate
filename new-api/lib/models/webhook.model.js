import Joi from 'joi';

class WebhookModel {
    static get schema() {

        return {
            id: Joi.string(), // using UUID on redis
            webhookUrl: Joi.string().trim(),
            webhookVerb: Joi
                .string()
                .valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH')
                .trim(),
            webhookPayloadType: Joi
                .string()
                .valid('None', 'JSON', 'XML')
                .trim(),
            webhookPayload: Joi.string().trim()
        };
    };
}

module.exports = WebhookModel;
