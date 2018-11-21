module.exports = function ({ agent }) {

    return { textResponse: agent.fallbackResponses[Math.floor(Math.random() * agent.fallbackResponses.length)] };
};
