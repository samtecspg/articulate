'use strict';
const Async = require('async');
const AgentTools = require('../tools');
const Boom = require('boom');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');

// TODO: PATH 1
module.exports = (request, reply) => {
    const { id: agentId, sessionId, text, timezone } = request.plugins['flow-loader'];
    RegisterHandlebarHelpers(Handlebars);
    const server = request.server;

    Async.waterfall([
        (callback) => {

            Async.parallel({
                parse: (cb) => {
                    // TODO: PATH 1.1
                    server.inject(`/agent/${agentId}/parse?text=${text}&${(timezone ? 'timezone=' + timezone : '')}`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound(res.result.message);
                                return cb(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, res.result.message);
                            return cb(error, null);
                        }
                        return cb(null, res.result.result.results);
                    });
                },
                agent: (cb) => {

                    // TODO: PATH 1.2
                    server.inject(`/agent/${agentId}/export?withReferences=true`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 400) {
                                const errorNotFound = Boom.notFound(res.result.message);
                                return cb(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                            return cb(error, null);
                        }
                        return cb(null, res.result);
                    });
                },
                // TODO: PATH 1.3
                context: (cb) => {

                    server.inject(`/context/${sessionId}`, (res) => {

                        if (res.statusCode !== 200) {
                            const error = Boom.create(res.statusCode, `An error occurred getting the context of the session ${sessionId}`);
                            return cb(error, null);
                        }
                        return cb(null, res.result);
                    });
                }
            }, (err, results) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, results);
            });
        },
        // TODO: PATH 1.4
        (conversationStateObject, callback) => {

            const timezoneToUse = timezone ? timezone : (conversationStateObject.agent.timezone ? conversationStateObject.agent.timezone : 'UTC');
            conversationStateObject.text = text;
            conversationStateObject.sessionId = sessionId;
            conversationStateObject.timezone = timezoneToUse;
            if (request.payload) {
                Object.keys(request.payload).forEach((key) => {

                    if (!conversationStateObject[key]) {
                        conversationStateObject[key] = request.payload[key];
                    }
                    else {
                        if (['text', 'timezone', 'sessionId'].indexOf(key) === -1) {
                            console.error(`POST value {{${key}}} overwritten by Articulate. {{${key}}} is a reserved keyword.`);
                        }
                    }
                });
            }
            // TODO: PATH 1.4.1
            AgentTools.respond(server, conversationStateObject, (err, result) => {

                if (err) {
                    return callback(err, null, null);
                }
                return callback(null, result, conversationStateObject);
            });
        }
    ], (err, data, conversationStateObject) => {

        if (err) {
            return reply(err);
        }
        let postFormatPayloadToUse;
        let usedPostFormatIntent;
        if (conversationStateObject.intent.usePostFormat) {
            postFormatPayloadToUse = conversationStateObject.intent.postFormat.postFormatPayload;
            usedPostFormatIntent = true;
        }
        else if (conversationStateObject.agent.usePostFormat) {
            usedPostFormatIntent = false;
            postFormatPayloadToUse = conversationStateObject.agent.postFormat.postFormatPayload;
        }
        if (postFormatPayloadToUse) {
            try {
                const compiledPostFormat = Handlebars.compile(postFormatPayloadToUse);
                const processedPostFormat = compiledPostFormat(Object.assign(conversationStateObject, { textResponse: data.textResponse }));
                let processedPostFormatJson = {};
                processedPostFormatJson = JSON.parse(processedPostFormat);
                if (!processedPostFormatJson.textResponse) {
                    processedPostFormatJson.textResponse = data.textResponse;
                }
                return reply(processedPostFormatJson);
            }
            catch (error) {
                const errorMessage = usedPostFormatIntent ? 'Error formatting the post response using intent POST format : ' : 'Error formatting the post response using agent POST format : ';
                console.log(errorMessage, error);
                return reply({
                    textResponse: data.textResponse,
                    postFormating: errorMessage + error
                });
            }

        }

        else {
            return reply({ textResponse: data.textResponse });
        }

    });
};
