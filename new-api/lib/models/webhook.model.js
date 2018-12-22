import Joi from 'joi';

class WebhookModel {
    static get schema() {

        return {
            id: Joi.number(),
            webhookUrl: Joi.string().trim(),
            webhookVerb: Joi
                .string()
                .valid('GET', 'PUT', 'POST', 'DELETE', 'PATCH')
                .trim(),
            webhookPayloadType: Joi
                .string()
                .valid('None', 'JSON', 'XML')
                .trim(),
            webhookPayload: Joi.string().trim(),
            webhookHeaders: Joi.array().items({
                key: Joi.string(),
                value: Joi.string(),
            }),
            webhookUser: Joi.string().allow(''),
            webhookPassword: Joi.string().allow('')
        };
    };
}

module.exports = WebhookModel;
