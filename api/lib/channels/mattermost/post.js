module.exports = async function ({ connection, request, h }) {

  const { agentService, channelService } = request.services();
  const event = request.payload;

  if(!await validateIncomingToken(event, connection)){
    return h.response();
  }

  await sendFakeResponseIfNeeded(event, channelService, connection);
  await sendRealResponses(request, agentService, connection, event, channelService)

  return h.response().code(200);
}

async function validateIncomingToken(event, connection){
  if(await isRegularRequest(event)){
    return event.token === connection.details.botAccessTokenOutgoingWebhook;
  }
  if(await isSlashCommandEntered(event)){
    return event.token === connection.details.botAccessTokenSlashCommand;
  }
  if(await isQuickResponseSelected(event)){
    return event.context.token === connection.details.botAccessTokenOutgoingWebhook ||
            event.context.token === connection.details.botAccessTokenSlashCommand
    ;
  }
}

async function sendFakeResponseIfNeeded(event, channelService, connection){
  if(await fakeResponseIsNeeded(event)){
    var fakeResponseMessage = await buildFakeResponseMessage(event, connection);
    await printFakeResponse(fakeResponseMessage, channelService, connection, event);  
  }
}

async function sendRealResponses(request, agentService, connection, event, channelService){
  connection.callbackURL = await buildOwnURL(request);
  var response = await converse(agentService, connection, event, channelService);
  if (!connection.details.outgoingMessages){
    await channelService.reply({ connection, event, response});
  }
}

async function fakeResponseIsNeeded(event){
  return await isSlashCommandEntered(event) || isQuickResponseSelected(event);
}

async function buildFakeResponseMessage(event, connection){
  var prefix = await buildFakeResponsePrefix(event, connection);
  var enteredDialog  = prefix + await getEnteredDialog(event);
  return {textResponse : enteredDialog,
          quickResponses : null}
}

async function buildFakeResponsePrefix(event, connection){
  var userSpecifiedPrefix = connection.details.userSelectionsPrefix;
  return  userSpecifiedPrefix !== "" ? userSpecifiedPrefix + " " : await getUserName(event) + " said: "
}

async function printFakeResponse(response, channelService, connection, event){
  await channelService.reply({ connection, event, response});
}

async function buildOwnURL(request) {
  return request.headers['x-scheme']+"://"+request.headers.host + request.headers['x-request-uri'];
}

async function converse(agentService, connection, event, channelService){
  var sessionId = await channelService.hash({ connection, event });
  var enteredDialog = await getEnteredDialog(event);
  return await agentService.converse({ 
    id: connection.agent,
    sessionId,
    text: enteredDialog,
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
}

async function getEnteredDialog(event){
  var text = await isQuickResponseSelected(event) ? event.context.text : event.text; 
  return text;
}

async function isRegularRequest(event){
  return !await isSlashCommandEntered(event) && !await isQuickResponseSelected(event) && event.token;
}

async function isSlashCommandEntered(event){
  return event.command;
}

async function isQuickResponseSelected(event){
  return event.context;
}

async function getUserName(event){
  return await isQuickResponseSelected(event) ? event.context.user_name : event.user_name;
}