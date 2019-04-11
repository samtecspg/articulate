module.exports = async function ({ connection, request, h }) {

    const { agentService, channelService } = request.services();

    const event = request.payload;

    if (event.type == 'url_verification') {

      return h.response(event.challenge).code(200)
    } else {

      if (event.type == 'message' && !event.subtype) {
        const sessionId = await channelService.hash({ connection, event });

        const response = await agentService.converse({ 
            id: connection.agent,
            sessionId,
            text: event.event.text,
            timezone: null,
            debug: false,
            additionalKeys: {
              ubiquity: {
                connection,
                event
              }
            }
        })
  
        channelService.reply({ connection, event, response})
      }

      return h.response().code(200);
    }
};

