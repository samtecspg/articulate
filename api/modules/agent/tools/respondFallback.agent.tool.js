'use strict';

const CallWebhook = require('./callWebhook.agent.tool');

module.exports = (data, currentContext, timezone, callback) => {

    const response = {
        timestamp: new Date().toISOString(),
        currentContext,
        timezone
    };

    if (data.agent.useWebhookFallback) {
        CallWebhook(data.agent.webhookFallbackUrl, response, (err, webhookResponse) => {

            if (err){
                return callback(err, null);
            }
            return callback(null, webhookResponse);
        });
    }
    else {
        const textResponse = data.agent.fallbackResponses[Math.floor(Math.random() * data.agent.fallbackResponses.length)];
        return callback(null, Object.assign(response, { textResponse } ));
    }
};
