'use strict'
const shortid = require('shortid');
const Crypto = require('crypto');
const { RTMClient, WebClient } = require('@slack/client');

let self = {
  webClients: {},
  rtmClients: {},
  info: {
    "name": "Slack",
    "description": "A quick connection to Slack using the Events API.",
    "documentation": null
  },
  hash: function( message ) {
    var secret = {
      channel: message.channel
    }
    var hash = Crypto.createHmac('sha256', JSON.stringify(secret)).digest('hex');;
  
    return hash
  },
  converse: function(server, channel, message) {
    let sessionId = self.hash(message)
    let options = {
      method: 'POST',
      url: `/agent/${channel.agent}/converse`,
      payload: {
        text: message.text,
        sessionId: sessionId
      }
    }

    server.inject(options, (res) => {

      const agentResponse = JSON.parse(res.payload).textResponse;
      console.log(agentResponse)

      self.respond(agentResponse, channel, message)
    })
  },
  respond: function ( response, channel, message ) {
    if (!self.webClients[channel.id]) {
      self.webClients[channel.id] = new WebClient(channel.botToken);
    }

    self.webClients[channel.id].chat.postMessage({ channel: message.channel, text: response })
      .then((res) => {
        // `res` contains information about the posted message
        console.log('Message sent: ', res.ts);
      })
      .catch(console.error);
  },
  init: function(server, request, channel) {

    if (request) {
      channel = {
        id: shortid.generate(),
        agent: request.payload.agent,
        service: request.payload.service,
        botToken: request.payload.details.botToken,
        status: 'Created',
        dateCreated: new Date(),
        dateModified: new Date()
      }
    }

    // The client is initialized and then started to get an active connection to the platform
    self.rtmClients[channel.id] = new RTMClient(channel.botToken);
    self.rtmClients[channel.id].start();

    self.rtmClients[channel.id].on('message', (event) => {
      // For structure of `event`, see https://api.slack.com/events/message

      // Skip messages that are from a bot or my own user ID
      if (event.subtype && event.subtype === 'bot_message') {
        return;
      }

      // Only reply to direct mentions or direct messages
      if (event.channel.charAt(0) == 'D' || event.text.includes(self.rtmClients[channel.id].activeUserId)) {
        console.log('Message Received.', event)
        self.converse(server, channel, event)
      }

    });

    if (request) {
      return response
    }
  },
  handleGet: function(server, request, channel, reply) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  },
  handlePost: function( server, request, channel, reply ) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  }
}

module.exports = self;



// Old handle post functionality

    // const redis = server.app.redis;
    // let payload = request.payload;

    // console.log(payload)

    // if (payload.type == "url_verification") {
    //   if (payload.token == channel.verificationToken) {

    //     // Responds with the challenge token from the request
    //     redis.hget('ubiquity', `channel:${channel.id}`, function( err, res ) {
    //       if (err) throw err;

    //       let channel = JSON.parse(res);
    //       channel.status = 'Verified';
    //       channel.dateModified = new Date();

    //       redis.hset('ubiquity', `channel:${channel.id}`, JSON.stringify(channel), function( err, res ) {
    //         reply(payload.challenge).type("text/plain").code(200)
    //       })
    //     })
    //   } else {
    //     reply("Tokens don't match").code(403)
    //   }
    // } else if (payload.type == "event_callback") {

    //   if (!self.slackClients[channel.id]) {
    //     self.slackClients[channel.id] = new WebClient(channel.botToken);
    //   }
    //   reply().code(200)

    //   if (payload.event.type == "message") {
        
    //   }

    //   if (payload.event.type == "app_mention") {
    //     let userMessage = payload.event.text;
    //     let slackChannel = payload.event.channel;
    //     let botUsers = payload.authed_users
    //     botUsers.forEach((bot) => {
    //       let botId = `<@${bot}>`
    //       let regex = new RegExp(botId, "g");
    //       userMessage = userMessage.replace(regex,'');
    //     })

    //     let sessionId = hash(payload)
    //     let options = {
    //       method: 'POST',
    //       url: `/agent/${channel.agent}/converse`,
    //       payload: {
    //         text: userMessage,
    //         sessionId: sessionId
    //       }
    //     }

    //     server.inject(options, (res) => {

    //       const agentResponse = JSON.parse(res.payload).textResponse;
    //       console.log(agentResponse)

    //       self.slackClients[channel.id].chat.postMessage({ channel: slackChannel, text: agentResponse })
    //         .then((res) => {
    //           // `res` contains information about the posted message
    //           console.log('Message sent: ', res.ts);
    //         })
    //         .catch(console.error);
    //     })
        
    //   }
    // }