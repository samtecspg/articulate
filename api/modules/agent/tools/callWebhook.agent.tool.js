'use strict';

const Axios = require('axios');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');
const Querystring = require('querystring');

module.exports = (webhook, conversationStateObject, callback) => {

    RegisterHandlebarHelpers(Handlebars);
    const compiledWebhookUrl = Handlebars.compile(webhook.webhookUrl);
    const processedWebhookUrl = compiledWebhookUrl(conversationStateObject);
    let compiledWebhookPayload;
    let processedWebhookPayload;

    let options = {
        method: webhook.webhookVerb,
        url: processedWebhookUrl,
        responseType: webhook.webhookPayloadType === 'XML' ? 'text' : 'json'
    }

    if (webhook.webhookPayloadType !== 'None' && webhook.webhookPayload !== ''){
        compiledWebhookPayload = Handlebars.compile(webhook.webhookPayload);
        processedWebhookPayload = compiledWebhookPayload(conversationStateObject);
        options.data = processedWebhookPayload ? (webhook.webhookPayloadType === 'URL Encoded' ? Querystring.stringify(JSON.parse(webhook.webhookPayload)) : (webhook.webhookPayloadType === 'JSON' ? JSON.parse(processedWebhookPayload) : processedWebhookPayload)) : '';
        options.headers = {
            'Content-Type': processedWebhookPayload ? (webhook.webhookPayloadType === 'URL Encoded' ? 'application/x-www-form-urlencoded' : (webhook.webhookPayloadType === 'JSON' ? 'application/json' : 'text/xml')) : ''
        };
    }

    if (webhook.webhookUsername !== 'None' && webhook.webhookUsername !== '') {
        options.auth = {
            username: webhook.webhookUsername,
            password: webhook.webhookPassword
        }
    };

    Axios(options)
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
