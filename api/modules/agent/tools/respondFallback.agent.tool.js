'use strict';

module.exports = (conversationStateObject, callback) => {

    const textResponse = conversationStateObject.agent.fallbackResponses[Math.floor(Math.random() * conversationStateObject.agent.fallbackResponses.length)];
    return callback(null, { textResponse } );
};
