module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();

  let event = request.payload;

  if (event.type === 'url_verification') {

    return h.response(event.challenge).code(200)
  } else {

    if (event.event && event.event.subtype !== 'bot_message' && event.event.subtype !== 'bot_add') {
      const sessionId = await channelService.hash({ connection, event });

      const response = agentService.converse({
        id: connection.agent,
        sessionId,
        text: event.event.text,
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
      })

      response.then((response, error) => {
        if (error) {
          console.log(error);
        } else if (!connection.details.outgoingMessages) {
          channelService.reply({ connection, event, response });
        }
      });
    }

    if (event.payload && typeof event.payload === 'string') {

      event = JSON.parse(event.payload);

      if (event.type === 'block_actions') {
        event.api_app_id = JSON.parse(event.actions[0].value).api_app_id;
        event.event = {
          channel: event.channel.id,
          user: event.user.id
        };
        const sessionId = await channelService.hash({ connection, event });

        const response = agentService.converse({
          id: connection.agent,
          sessionId,
          text: event.actions[0].text.text,
          timezone: null,
          debug: false,
          additionalKeys: {
            ubiquity: {
              connection,
              event
            }
          }
        })

        response.then((response, error) => {
          if (error) {
            console.log(error);
          } else if (!connection.details.outgoingMessages) {
            channelService.reply({ connection, event, response });
          }
        });

      }
    }
    return h.response().code(200);
  }
};

