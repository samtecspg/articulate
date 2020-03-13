import Twilio from 'twilio';

module.exports = async function ({ connection, request, h }) {

    const { agentService, channelService } = request.services();

    const event = request.payload;

    //If the whitelist is empty (allow all the numbers), or, the number is in the whitelist
    //and the number is not in the black list, then respond
    if ((connection.details.whiteList.length === 0 || connection.details.whiteList.indexOf(event['From']) !== -1) 
    && connection.details.blackList.indexOf(event['From']) === -1){  
      
      const sessionId = await channelService.hash({ connection, event });

      const response = await agentService.converse({ 
          id: connection.agent,
          sessionId,
          text: event.Body,
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
        await channelService.reply({ connection, event, response, sessionId });
      }

      return h.response().code(200);
    }
    else {
      return h.response().code(403);
    }
};

