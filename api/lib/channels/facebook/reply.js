import BootBot from 'bootbot';

module.exports = async function({
    connection,
    event,
    response
}) {
    const bot = new BootBot({
        accessToken: connection.details.pageAccessToken,
        verifyToken: connection.details.verifyToken,
        appSecret: connection.details.appSecret
    });

    const finalResponse = {
        text: response.textResponse
    }
    if (response.quickResponses){
        finalResponse.quickReplies = response.quickResponses;
    }
    bot.say(event.sender.id, response.quickResponses ? finalResponse : response.textResponse);
}