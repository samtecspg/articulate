import { actionssdk } from 'actions-on-google';

module.exports = async function ({ event, response }) {

  const app = actionssdk();

  app.intent('actions.intent.MAIN', conv => {
    conv.ask(response.textResponse);
  });

  app.intent('actions.intent.TEXT', (conv, input) => {
    if (response.closeConnection){
      conv.close(response.textResponse);
    }
    conv.ask(response.textResponse);
  });

  return await app.handler(event, {});
}