'use strict'
const shortid = require('shortid');
const Crypto = require('crypto');
const Wreck = require('wreck');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

function hash( message ) {
  var secret = {
    phoneNumber: message['From']
  }
  var hash = Crypto.createHmac('sha256', JSON.stringify(secret)).digest('hex');;

  return hash
}

module.exports = {
  info: {
    "name": "Slack",
    "description": "A quick connection to Slack using the Events API.",
    "documentation": null
  },
  init: function(request) {

    let response = {
      id: shortid.generate(),
      agent: request.payload.agent,
      service: request.payload.service,
      verificationToken: request.payload.details.verificationToken,
      status: 'Created',
      dateCreated: new Date(),
      dateModified: new Date()
    }

    return response
  },
  handleGet: function(server, request, channel, reply) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  },
  handlePost: function( server, request, channel, reply ) {
    const redis = server.app.redis;
    let payload = request.payload;

    if (payload.type == "url_verification") {
      if (payload.token == channel.verificationToken) {

        // Responds with the challenge token from the request
        redis.hget('ubiquity', `channel:${channel.id}`, function( err, res ) {
          if (err) throw err;

          let channel = JSON.parse(res);
          channel.status = 'Verified';
          channel.dateModified = new Date();

          redis.hset('ubiquity', `channel:${channel.id}`, JSON.stringify(channel), function( err, res ) {
            reply(payload.challenge).type("text/plain").code(200)
          })
        })
      } else {
        reply("Tokens don't match").code(403)
      }
    } else if (payload.type == "event_callback") {
      if (payload.event.type == "message") {
        console.log(payload)
        reply().code(200)
      }

      if (payload.event.type == "app_mention") {

        let message = payload.event.text;
        let botUsers = payload.authed_users
        botUsers.forEach((bot) => {
          let botId = `<@${bot}>`
          let regex = new RegExp(botId, "g");
          message = message.replace(regex,'');
        })

        message = message.trim()
        reply().code(200)
      }
    }

    // // Checks this is an event from a page subscription
    // if (payload.From && payload.Body) {

    //   let sessionId = hash(payload)
    //   let options = {
    //     method: 'POST',
    //     url: `/agent/${channel.agent}/converse`,
    //     payload: {
    //       text: payload.Body,
    //       sessionId: sessionId
    //     }
    //   }

    //   server.inject(options, (res) => {

    //     var twiml = new MessagingResponse();
    //     twiml.message(JSON.parse(res.payload).textResponse);

    //     reply(twiml.toString()).header('Content-Type', 'text/xml').code(200);
    //   })
    // } else {
    //   reply().code(400)
    // }
  }
}