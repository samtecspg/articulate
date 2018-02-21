'use strict';

const Axios = require('axios');
const Handlebars = require('handlebars');

module.exports = (webhook, conversationStateObject, callback) => {

    const compiledWebhookUrl = Handlebars.compile(webhook.webhookUrl);
    const processedWebhookUrl = compiledWebhookUrl(conversationStateObject);
    let compiledWebhookPayload;
    let processedWebhookPayload;
    if (webhook.webhookPayloadType !== 'None'){
        compiledWebhookPayload = Handlebars.compile(webhook.webhookPayload);
        processedWebhookPayload = compiledWebhookPayload(conversationStateObject);
    }

    Axios({
        method: webhook.webhookVerb,
        url: processedWebhookUrl,
        data: JSON.parse(processedWebhookPayload)
    })
    .then((response) => {

        return callback(response.data);
    })
    .catch(() => {

        return callback({
            textResponse: 'We\'re having trouble fulfilling that request'
        });
    });
};
