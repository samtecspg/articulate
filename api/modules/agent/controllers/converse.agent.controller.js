'use strict';
const Async = require('async');
const AgentTools = require('../tools');
const Boom = require('boom');


module.exports = (request, reply) => {

    const agentId = request.params.id;
    let sessionId;
    let text;
    let timezone;
    if (request.payload){
        sessionId = request.payload.sessionId;
        text = request.payload.text;
        timezone = request.payload.timezone;
    }
    else {
        sessionId = request.query.sessionId;
        text = request.query.text;
        timezone = request.query.timezone;
    }
    const server = request.server;

    Async.waterfall([
        (callback) => {

            Async.parallel({
                parseResult: (cb) => {

                    server.inject(`/agent/${agentId}/parse?text=${text}${(timezone ? 'timezone=' + timezone : '')}`, (res) => {

                        if (res.statusCode !== 200){
                            if (res.statusCode === 404){
                                const errorNotFound = Boom.notFound(res.result.message);
                                return cb(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error ocurred parsing the document');
                            return cb(error, null);
                        }
                        return cb(null, res.result);
                    });
                },
                agentData: (cb) => {

                    server.inject(`/agent/${agentId}/export`, (res) => {

                        if (res.statusCode !== 200){
                            if (res.statusCode === 400){
                                const errorNotFound = Boom.notFound(res.result.message);
                                return cb(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error ocurred get the agent data');
                            return cb(error, null);
                        }
                        return cb(null, res.result);
                    });
                }
            }, (err, results) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, results);
            });
        },
        (data, callback) => {

            const timezoneToUse = timezone ? timezone : (data.agentData.timezone ? data.agentData.timezone : 'America/Kentucky/Louisville');
            AgentTools.respond(server, sessionId, timezoneToUse, data, (err, result) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, result);
            });
        }
    ], (err, data) => {

        if (err){
            return reply(err);
        }

        return reply(data);
    });
};
