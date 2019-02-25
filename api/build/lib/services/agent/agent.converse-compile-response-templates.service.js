"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function ({
  responses,
  templateContext,
  isTextPrompt = false
}) {
  const handlebars = this.server.app.handlebars;

  let parsedResponses = _lodash.default.map(responses, response => {
    response = isTextPrompt ? {
      textResponse: response,
      actions: []
    } : response;
    const match = response.textResponse.match(/{{/g);
    const numberOfSlots = match ? match.length : 0;
    const compiledResponse = handlebars.compile(response.textResponse, {
      strict: true
    });

    try {
      return {
        textResponse: compiledResponse(templateContext),
        numberOfSlots,
        actions: response.actions
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  });

  parsedResponses = _lodash.default.compact(parsedResponses);

  if (parsedResponses.length > 0) {
    parsedResponses = _lodash.default.filter(parsedResponses, parsedResponse => {
      return parsedResponse.textResponse !== '';
    });
  }

  if (parsedResponses.length > 0) {
    const maxNumberOfExpressions = _lodash.default.max(_lodash.default.map(parsedResponses, 'numberOfSlots'));

    parsedResponses = _lodash.default.filter(parsedResponses, parsedResponse => {
      return parsedResponse.numberOfSlots === maxNumberOfExpressions;
    });
  }

  if (parsedResponses.length > 0) {
    return parsedResponses[Math.floor(Math.random() * parsedResponses.length)];
  }

  return {
    textResponse: 'Sorry we’re not sure how to respond.',
    actions: []
  };
};
//# sourceMappingURL=agent.converse-compile-response-templates.service.js.map