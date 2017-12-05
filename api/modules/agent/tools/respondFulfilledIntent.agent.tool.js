'use strict';

const BuildValidResponses = require('./buildValidResponses.agent.tool');
const CallWebhook = require('./callWebhook.agent.tool');

module.exports = (userText, currentContext, intentScenario, timezone, webhookUrl, callback) => {

    const response = {
        timestamp: new Date().toISOString(),
        currentContext,
        timezone
    };

    if (intentScenario.useWebhook === 'true') {
        CallWebhook(intentScenario.webhookUrl ? intentScenario.webhookUrl : webhookUrl, response, (err, webhookResponse) => {

            if (err){
                return callback(err, null);
            }
            return callback(null, webhookResponse);
        });
    }
    else {
        const validResponses = BuildValidResponses(userText, currentContext, intentScenario.slots, intentScenario.intentResponses, timezone);
        const textResponse = validResponses[Math.floor(Math.random() * validResponses.length)];
        //return callback(null, { response: textResponse });
        return callback(null, Object.assign(response, { textResponse }));
    }
};
