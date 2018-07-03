'use strict'
const shortid = require('shortid');
const Crypto = require('crypto');
const Wreck = require('wreck');

function hash( message ) {
  var secret = {
      channel: message.sender.id
  }
  var hash = Crypto.createHmac('sha256', JSON.stringify(secret)).digest('hex');;

  return hash
}

module.exports = {
  info: {
    "name": "Facebook Messenger",
    "description": "A quick connection to the webhook of Facebook messenger bots.",
    "documentation": null
  },
  init: function(server, request) {

    let response = {
      id: shortid.generate(),
      agent: request.payload.agent,
      service: request.payload.service,
      pageToken: request.payload.details.pageToken,
      status: 'Created',
      dateCreated: new Date(),
      dateModified: new Date()
    }

    response.validationToken = Crypto.createHmac('sha256', JSON.stringify(request.payload.agent + '-' + request.payload.service)).digest('hex');

    return response
  },
  handleGet: function(server, request, channel, reply) {
    const redis = server.app.redis;

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = channel.validationToken;

      // Parse the query params
    let mode = request.query['hub.mode'];
    let token = request.query['hub.verify_token'];
    let challenge = request.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        redis.hget('ubiquity', `channel:${channel.id}`, function( err, res ) {
          if (err) throw err;

          let channel = JSON.parse(res);
          channel.status = 'Verified';
          channel.dateModified = new Date();

          redis.hset('ubiquity', `channel:${channel.id}`, JSON.stringify(channel), function( err, res ) {
            reply(challenge).code(200);
          })
        })
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        reply().code(403)
      }
    } else {
      reply().code(400)
    }
  },
  handlePost: function( server, request, channel, reply ) {
    const redis = server.app.redis;
    let body = request.payload;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {

        console.log(entry)
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        let sessionId = hash(webhook_event)
        let options = {
          method: 'POST',
          url: `/agent/${channel.agent}/converse`,
          payload: {
            text: webhook_event.message.text,
            sessionId: sessionId
          }
        }

        server.inject(options, (res) => {

          let request = {
            payload: {
              "messaging_type": "RESPONSE",
              "recipient": webhook_event.sender,
              "message": {
                "text": JSON.parse(res.payload).textResponse
              }
            },
            headers: {
              "Content-Type": "application/json"
            }
          }
          Wreck.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${channel.pageToken}`, request, (err, response, payload) => {
            if (err) throw err;
          })
        })
      });
  
      // Returns a '200 OK' response to all requests
      reply('EVENT_RECEIVED').code(200);
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      reply().code(404);
    }
  }
}