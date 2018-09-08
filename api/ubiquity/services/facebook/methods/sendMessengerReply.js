const Wreck = require('wreck');

module.exports = (reply, token, recipient) => {

  let request = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  if (reply.facebook) {
    request.payload = reply.facebook
  } else {
    request.payload = {
      recipient: recipient,
      message: {
        text: reply.textResponse
      }
    }

    if (reply.buttons) {
      request.payload.message.quick_replies = [];
      for (button in reply.buttons) {
        request.payload.message.quick_replies.push(reply.buttons[button]);
      }
    }
  }

  Wreck.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${token}`, request, (err, response, payload) => {
    if (err) console.log(err);
  })
}