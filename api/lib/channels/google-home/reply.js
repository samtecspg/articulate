import { actionssdk } from 'actions-on-google';

module.exports = async function ({ event, response }) {

  const app = actionssdk();

  app.intent('actions.intent.MAIN', conv => {
    conv.ask(response.textResponse);
  });

  app.intent('actions.intent.TEXT', (conv, input) => {
    if (response.closeGoogleActions){
      conv.close(response.textResponse);
    }
    else {
      conv.ask(response.textResponse);
    }
  });

  return await app.handler(event, {});
}