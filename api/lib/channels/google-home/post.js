module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();

  const event = request.payload;
  const sessionId = await channelService.hash({ connection, event });

  const response = await agentService.converse({ 
      id: connection.agent,
      sessionId,
      text: event.inputs[0].rawInputs[0].query,
      timezone: null,
      debug: false,
      additionalKeys: {
        ubiquity: {
          connection,
          event
        },
        welcomeActionOptions: {
          useWelcomeActionIfFirstMessage: connection.details.useAgentWelcomeAction
        }
      }
  });

  const responsePayload = await channelService.reply({ connection, event, response, sessionId });

  return h.response(responsePayload.body).code(responsePayload.status);
};
