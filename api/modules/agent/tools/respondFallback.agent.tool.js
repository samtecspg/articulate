'use strict';

const CallWebhook = require('./callWebhook.agent.tool');

module.exports = (conversationStateObject, callback) => {

    const textResponse = conversationStateObject.agent.fallbackResponses[Math.floor(Math.random() * conversationStateObject.agent.fallbackResponses.length)];
    return callback(null, { textResponse } );

    /*if (data.agentData.useWebhookFallback === 'true') {
        CallWebhook(data.agentData.webhookFallbackUrl, response, (err, webhookResponse) => {

            if (err){
                return callback(err, null);
            }
            return callback(null, webhookResponse);
        });
    }
    else {
        const textResponse = data.agentData.fallbackResponses[Math.floor(Math.random() * data.agentData.fallbackResponses.length)];
        return callback(null, Object.assign(response, { textResponse } ));
    }*/
};
