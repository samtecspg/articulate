const axios = require('axios')

module.exports = async function({ connection, event, response}) {
    var payload = await buildReplyPayload(response, event, connection);
    await axios.post(connection.details.incomingWebhookURL, payload);
}

async function buildReplyPayload(response, event, connection){

    var channel_name = await getChannelName(event);
    var attachments = await buildQuickResponseAttachments(response, connection, event);

    return {
        text: response.textResponse,
        channel: channel_name,
        username: connection.details.userName,
        attachments
    };
  } 

async function getChannelName(event){
    return await isQuickResponseSelected(event) ? event.context.channel_name : event.channel_name;
}

async function getUserName(event){
    return await isQuickResponseSelected(event) ? event.context.user_name : event.user_name;
}

async function isQuickResponseSelected(event){
    return event.context;
}

async function buildQuickResponseAttachments(response, connection, event){
    var attachments = [];
        if (await isQuickResponseRequest(response)){
            var token = await getToken(event);
            var channel_name = await getChannelName(event);
            var user_name = await getUserName(event);
            var actions = response.quickResponses.map((quickResponse) => {
                return {
                    name: quickResponse,
                    integration:{
                        url: connection.callbackURL,
                            context: {
                            text: quickResponse,
                            token,
                            channel_name,
                            user_name
                            }
                    }
                }
            });
            var temp = {actions};
            attachments.push(temp);
    }
    return attachments;
  } 

async function isQuickResponseRequest(response){
    return response.quickResponses;
}

async function getToken(event){
    return await isQuickResponseSelected(event) ? event.context.token : event.token
}