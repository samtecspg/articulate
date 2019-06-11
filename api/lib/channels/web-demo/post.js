import Boom from 'boom';

module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();

  const event = request.payload;
  const sessionId = await channelService.hash({ connection, event });

  try {
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
        }
      }
    });
  
    return h.response(response).code(200);
  }
  catch ({ message, statusCode }) {
      return new Boom(message, { statusCode });
  }
};

