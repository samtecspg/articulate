const { WebClient } = require('@slack/client');

module.exports = async function({ connection, event, response }) {

    const web = new WebClient(connection.details.botAccessToken);

    let attachments;
    if (response.quickResponses){
        const actions = response.quickResponses.map((quickResponse, index) => {

            return {
                name: `{ "api_app_id": "${event.api_app_id}", "quickResponse": ${index + 1} }`,
                text: quickResponse,
                type: 'button',
                value: quickResponse
            }
        });
        attachments = [
            {
                text: "",
                fallback: "Quick response not selected",
                callback_id: "quickResponse",
                color: "#3AA3E3",
                attachment_type: "default",
                actions
            }
        ]
    }

    web.chat.postMessage({ channel: event.event.channel, text: response.textResponse, attachments });
}