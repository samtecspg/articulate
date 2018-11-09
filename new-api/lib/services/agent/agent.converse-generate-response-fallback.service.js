module.exports = function ({ agent }) {

    return agent.fallbackResponses[Math.floor(Math.random() * agent.fallbackResponses.length)];
};
