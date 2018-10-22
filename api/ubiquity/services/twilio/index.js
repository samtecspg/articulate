'use strict'
const shortid = require('shortid');
const Crypto = require('crypto');
const Twilio = require('twilio');
const Logger = require("../../logger.js");

const validateInit = require('./methods/validateInit');

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

    if (request) {
      const requestValidation = validateInit(request.payload);
      if (requestValidation.error === null) {

        let response = {
          id: shortid.generate(),
          agent: request.payload.agent,
          service: request.payload.service,
          authToken: request.payload.details.authToken,
          status: 'Created',
          dateCreated: new Date(),
          dateModified: new Date()
        }

        if (requestValidation.value.details.whiteList) {
          response.whiteList = requestValidation.value.details.whiteList;
        }

        return response
      } else {
        return Boom.badRequest('Invalid Request', requestValidation.error.ValidationError)
      }
    }
  },
  handleGet: function(server, request, channel, reply) {
    const redis = server.app.redis;

    reply('Not Implemented').code(400)
  },
  handlePost: function( server, request, channel, reply ) {
    const redis = server.app.redis;
    let payload = request.payload;

    //Using ngrok requests look like http even though the Twilio url is https
    //This causes validation to fail. For now forcing https.
    //console.log(request.connection.info)
    //Validate Request
      const url = (request.headers.schema || "https") + "://"
      + (request.headers.host || request.info.host)
      + (request.headers.basePath || "")
      + (request.headers.path || request.url.path);
      const twilioSignature = request.headers["x-twilio-signature"];
      const validation = Twilio.validateRequest(channel.authToken, twilioSignature, url, payload);

    if (validation) {
      if (payload.From && payload.Body) {
        if ((channel.whiteList && channel.whiteList.indexOf(payload.From) != -1) || !channel.whiteList || channel.whiteList == []) {
          let sessionId = hash(payload)
          let options = {
            method: 'POST',
            url: `/agent/${channel.agent}/converse`,
            payload: {
              text: payload.Body,
              sessionId: sessionId,
              ubiquity: {
                twilio: payload
              }
            }
          }

            const requestStart = new Date();
            server.inject(options, (res) => {

                const requestTime = new Date() - requestStart;
                const twiml = new Twilio.twiml.MessagingResponse();
                twiml.message(JSON.parse(res.payload).textResponse);

                Logger.log(options.payload, JSON.parse(res.payload), requestTime);

                reply(twiml.toString()).header('Content-Type', 'text/xml').code(200);
          })
        }
      } else {
        reply().code(400)
      }
    }
  }
}
