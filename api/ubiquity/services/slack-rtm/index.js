"use strict";
const ShortId = require("shortid");
const Crypto = require("crypto");
const { RTMClient, WebClient } = require("@slack/client");

let self = {
    webClients: {},
    rtmClients: {},
    info: {
        "name": "Slack",
        "description": "A quick connection to Slack using the Events API.",
        "documentation": null
    },
    hash: (message) => {

        const secret = {
            channel: message.channel
        };
        const hash = Crypto.createHmac("sha256", JSON.stringify(secret)).digest("hex");
        return hash;
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
        id: ShortId.generate(),
        agent: request.payload.agent,
        service: request.payload.service,
        botToken: request.payload.details.botToken,
        status: 'Created',
        dateCreated: new Date(),
        dateModified: new Date()
      }
    }

    console.log(channel);

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
      return channel
    }
  },
  handleGet: function(server, request, channel, reply) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  },
  handlePost: function( server, request, channel, reply ) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  },
  handleDelete: function( server, request, channel, reply ) {
    const redis = server.app.redis;

    self.rtmClients[channel.id].disconnect();
    redis.hdel('ubiquity', `channel:${request.params.id}`, function( err, res ) {
      if (err) throw err;

      reply(res)
    })
  }
}

module.exports = self;
