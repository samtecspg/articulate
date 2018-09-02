'use strict';

const BuildValidResponses = require('./buildValidResponses.agent.tool');

module.exports = (conversationStateObject, missingEntity, callback) => {

    const validResponses = BuildValidResponses(conversationStateObject, missingEntity.textPrompts);
    const textResponse = validResponses.length > 0 ? validResponses[Math.floor(Math.random() * validResponses.length)].response : '';
    const isActionComplete = false;
    return callback(null, { textResponse , isActionComplete } );
};
