import BootBot from 'bootbot';

module.exports = async function ({connection, event, response}) {
    const bot = new BootBot({
        accessToken: connection.details.appToken,
        verifyToken: connection.details.validationToken,
        appSecret: connection.details.appSecret
      });

      bot.say( event.sender.id, response.textResponse )
}