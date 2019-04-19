import { driver } from '@rocket.chat/sdk'

module.exports = async function({ connection, event, response }) {

  const HOST = connection.details.rocketchatURL;
  const USER = connection.details.rocketchatUser;
  const PASS = connection.details.rocketchatPassword;

  await driver.connect( { host: HOST });
  const botUserId = await driver.login({username: USER, password: PASS});

  if (event.user_id !== botUserId){
    await driver.sendToRoomId(response.textResponse, event.channel_id);
  }
}

