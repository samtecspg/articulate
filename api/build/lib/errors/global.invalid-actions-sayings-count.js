"use strict";

module.exports = ({
  statusCode = 400,
  actions
}) => {
  return {
    isHandled: true,
    statusCode,
    message: `Action(s) '${actions.join(', ')}' has only 1 training example! Minimum is 2. Please fix this before training the agent.`
  };
};
//# sourceMappingURL=global.invalid-actions-sayings-count.js.map