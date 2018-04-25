'use strict';

const Axios = require('axios');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');

module.exports = (webhook, conversationStateObject, callback) => {

    RegisterHandlebarHelpers(Handlebars);
    const compiledWebhookUrl = Handlebars.compile(webhook.webhookUrl);
    const processedWebhookUrl = compiledWebhookUrl(conversationStateObject);
    let compiledWebhookPayload;
    let processedWebhookPayload;
    if (webhook.webhookPayloadType !== 'None' && webhook.webhookPayload !== ''){
        compiledWebhookPayload = Handlebars.compile(webhook.webhookPayload);
        processedWebhookPayload = compiledWebhookPayload(conversationStateObject);
    }

    Axios({
        method: webhook.webhookVerb,
        url: processedWebhookUrl,
        data: processedWebhookPayload ? (webhook.webhookPayloadType === 'JSON' ? JSON.parse(processedWebhookPayload) : processedWebhookPayload) : '',
        headers: { 'Content-Type': processedWebhookPayload ? (webhook.webhookPayloadType === 'JSON' ? 'application/json' : 'text/xml') : '' },
        responseType: webhook.webhookPayloadType === 'XML' ? 'text' : 'json'
    })
    .then((response) => {

        return callback(response.data);
    })
    .catch((err) => {

        console.log('Error calling the webhook: ', err);
        return callback({
            textResponse: 'We\'re having trouble fulfilling that request'
        });
    });
};
