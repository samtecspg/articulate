'use strict';

const BuildValidResponses = require('./buildValidResponses.agent.tool');

module.exports = (conversationStateObject, missingEntity, callback) => {

    const response = {
        timestamp: new Date().toISOString(),
        currentContext: conversationStateObject.currentContext,
        timezone: conversationStateObject.timezone
    };

    const validResponses = BuildValidResponses(conversationStateObject, missingEntity.textPrompts);
    const textResponse = validResponses[Math.floor(Math.random() * validResponses.length)];
    return callback(null, Object.assign(response, { textResponse } ));
};
