module.exports = async function ({ connection, request, h }) {

    const { agentService, channelService } = request.services();

    let event = request.payload;

    if (event.type === 'url_verification') {

      return h.response(event.challenge).code(200)
    } else {

      if (event.event && event.event.subtype !== 'bot_message') {
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

        if (!connection.details.outgoingMessages){
          channelService.reply({ connection, event, response});
        }
  
      }

      if (event.payload && typeof event.payload === 'string'){

        event = JSON.parse(event.payload);

        if (event.type === 'interactive_message') {
          event.api_app_id = JSON.parse(event.actions[0].name).api_app_id;
          event.event = {
              channel: event.channel.id,
              user: event.user.id
          };
          const sessionId = await channelService.hash({ connection, event });
  
          const response = await agentService.converse({ 
              id: connection.agent,
              sessionId,
              text: event.actions[0].value,
              timezone: null,
              debug: false,
              additionalKeys: {
                ubiquity: {
                  connection,
                  event
                }
              }
          })
  
          if (!connection.details.outgoingMessages){
            channelService.reply({ connection, event, response});
          }
    
        }
      }

      return h.response().code(200);
    }
};

