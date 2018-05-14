'use strict';

const BuildValidResponses = require('./buildValidResponses.agent.tool');
const CallWebhook = require('./callWebhook.agent.tool');
const _ = require('lodash');

const getTextResponse = (conversationStateObject, webhookResponse) => {

    if (webhookResponse){
        conversationStateObject = _.merge(conversationStateObject, { webhookResponse });
    }
    const validResponses = BuildValidResponses(conversationStateObject, conversationStateObject.scenario.intentResponses);
    let textResponse;
    if (validResponses.length > 0){
        textResponse = validResponses[Math.floor(Math.random() * validResponses.length)].response;
    }
    else {
        textResponse = 'Sorry we’re not sure how to respond.';
        console.error(`Failed to generate valid response for intent ${conversationStateObject.intent.intentName}`);
    }
    return textResponse;
};

module.exports = (conversationStateObject, callback) => {

    if (conversationStateObject.intent.useWebhook || conversationStateObject.agent.useWebhook) {
        const webhookToUse = conversationStateObject.intent.useWebhook ? conversationStateObject.intent.webhook : conversationStateObject.agent.webhook;
        CallWebhook(webhookToUse, conversationStateObject, (webhookResponse) => {

            if (webhookResponse.textResponse){
                return callback(null, { textResponse: webhookResponse.textResponse });
            }
            const textResponse = getTextResponse(conversationStateObject, webhookResponse);
            return callback(null, Object.assign( { webhookResponse }, { textResponse }));
        });
    }
    else {
        const textResponse = getTextResponse(conversationStateObject);
        return callback(null, { textResponse });
    }
};
