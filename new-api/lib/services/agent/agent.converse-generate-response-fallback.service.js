module.exports = function ({ agent }) {

    const fallbackActionId = agent.fallbackAction;
    const fallbackAction = agent.actions.filter((action) => {
        return parseInt(action.id) === parseInt(fallbackActionId);
    })[0];
    const selectedFallbackResponse = fallbackAction.responses[Math.floor(Math.random() * fallbackAction.responses.length)];
    return { textResponse: selectedFallbackResponse.textResponse, actions: selectedFallbackResponse.actions, actionWasFulfilled: true };
};
