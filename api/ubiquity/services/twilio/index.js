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
    "name": "Twilio SMS",
    "description": "A quick connection to the webhook of Twilio SMS Numbers.",
    "documentation": null
  },
  init: function(server, request) {

    let response = {
      id: shortid.generate(),
      agent: request.payload.agent,
      service: request.payload.service,
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

    // Checks this is an event from a page subscription
    if (payload.From && payload.Body) {

      let sessionId = hash(payload)
      let options = {
        method: 'POST',
        url: `/agent/${channel.agent}/converse`,
        payload: {
          text: payload.Body,
          sessionId: sessionId
        }
      }

      server.inject(options, (res) => {

        var twiml = new MessagingResponse();
        twiml.message(JSON.parse(res.payload).textResponse);

        reply(twiml.toString()).header('Content-Type', 'text/xml').code(200);
      })
    } else {
      reply().code(400)
    }
  }
}