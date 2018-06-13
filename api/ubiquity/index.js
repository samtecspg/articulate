'use strict'
const Joi = require('joi');

const Facebook = require('./services/facebook')
const Twilio = require('./services/twilio')
const Slack = require('./services/slack')

const ubiquity = {
  facebook: Facebook,
  twilio: Twilio,
  slack: Slack
}

exports.register = function (server, options, next) {

  const redis = server.app.redis;

  server.route({
    method: 'GET',
    path: '/ubiquity',
    handler: function (request, reply) {
      var serviceList = Object.keys(ubiquity);
      var response = {
        services: [],
        channels: {}
      };

      serviceList.forEach((service) => {
        response.services.push(ubiquity[service].info)
      })

      redis.hgetall('ubiquity', function( err, res ) {
        if (err) throw err;

        let channels = Object.keys(res);
        channels.forEach((channel) => {
          let channelId = channel.split(':')[1]
          response.channels[channelId] = JSON.parse(res[channel])
        })

        reply(response)
      })
    }
  });

  server.route({
    method: 'POST',
    path: '/ubiquity',
    handler: function (request, reply) {

      let response = ubiquity[request.payload.service].init(request);

      redis.hset('ubiquity', 'channel:' + response.id, JSON.stringify(response), function( err, res) {
        if (err) throw err;
        reply(response);
      });
    },
    config: {
      validate: {
        payload: Joi.object().keys({
          agent: Joi.number().integer().required(),
          service: Joi.string().required(),
          details: Joi.object()
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/ubiquity/{id}',
    handler: function (request, reply) {

      redis.hget('ubiquity', `channel:${request.params.id}`, function( err, res ) {
        if (err) throw err;

        let channel = JSON.parse(res);
        let response = ubiquity[channel.service].handlePost(server, request, channel, reply);
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/ubiquity/{id}',
    handler: function (request, reply) {

      redis.hget('ubiquity', `channel:${request.params.id}`, function( err, res ) {
        if (err) throw err;

        let channel = JSON.parse(res);
        let response = ubiquity[channel.service].handleGet(server, request, channel, reply);
      })
    }
  })

  next();
}

exports.register.attributes = {
  name: 'Ubiquity',
  version: '0.0.0'
};