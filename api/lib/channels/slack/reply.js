const { WebClient } = require('@slack/client');

module.exports = async function({ connection, event, response }) {

    const web = new WebClient(connection.details.botAccessToken);

    web.chat.postMessage({ channel: event.event.channel, text: response.textResponse });
}