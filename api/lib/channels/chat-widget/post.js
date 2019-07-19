import Boom from 'boom';

module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();

  const event = request.payload;
  event.server = request.server;
  const sessionId = event.sessionId;

  try {
    await agentService.converse({ 
      id: connection.agent,
      sessionId,
      text: event.text,
      timezone: event.timezone ? event.timezone : null,
      debug: false,
      additionalKeys: {
        ubiquity: {
          connection,
          event
        }
      }
    });

    if (!connection.details.outgoingMessages){
      channelService.reply({ connection, event, response});
    }
  
    return h.response().code(200);
  }
  catch ({ message, statusCode }) {
      return new Boom(message, { statusCode });
  }
};

