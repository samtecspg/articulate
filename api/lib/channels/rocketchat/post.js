module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();

  const event = request.payload;
  const sessionId = await channelService.hash({ connection, event });

  const response = await agentService.converse({ 
    id: connection.agent,
    sessionId,
    text: event.text,
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

  if (!connection.details.outgoingMessages){
    channelService.reply({ connection, event, response});
  }

  return h.response().code(200);
};

