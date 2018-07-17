module.exports = function ({ agent }) {

    const fallbackAction = agent.actions.filter((action) => {
        return action.actionName === agent.fallbackAction;
    })[0];
    const selectedFallbackResponse = fallbackAction.responses[Math.floor(Math.random() * fallbackAction.responses.length)];
    return { textResponse: selectedFallbackResponse.textResponse, actions: selectedFallbackResponse.actions, actionWasFulfilled: true };
};
