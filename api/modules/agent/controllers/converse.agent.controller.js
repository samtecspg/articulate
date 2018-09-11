'use strict';
const Async = require('async');
const AgentTools = require('../tools');
const Boom = require('boom');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');

module.exports = (request, reply) => {

    const { id: agentId, sessionId, text, timezone } = request.plugins['flow-loader'];
    RegisterHandlebarHelpers(Handlebars);
    const server = request.server;

    Async.waterfall([
        (callback) => {

            Async.parallel({
                parse: (cb) => {

                    server.inject(`/agent/${agentId}/parse?text=${text}&${(timezone ? 'timezone=' + timezone : '')}`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 404) {
                                const errorNotFound = Boom.notFound(res.result.message);
                                return cb(errorNotFound);
                            }
                            const error = Boom.create(res.statusCode, res.result.message);
                            return cb(error, null);
                        }
                        return cb(null, res.result.result.results, res.result.id);
                    });
                },
                agent: (cb) => {

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
        (conversationStateObject, callback) => {

            const timezoneToUse = timezone ? timezone : (conversationStateObject.agent.timezone ? conversationStateObject.agent.timezone : 'UTC');
            conversationStateObject.docId = conversationStateObject.parse[1];
            conversationStateObject.parse = conversationStateObject.parse[0];
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
        data.docId = conversationStateObject.docId;
        let postFormatPayloadToUse;
        let usedPostFormatAction;
        if (conversationStateObject.action && conversationStateObject.action.usePostFormat) {
            postFormatPayloadToUse = conversationStateObject.action.postFormat.postFormatPayload;
            usedPostFormatAction = true;
        }
        else if (conversationStateObject.agent.usePostFormat) {
            usedPostFormatAction = false;
            postFormatPayloadToUse = conversationStateObject.agent.postFormat.postFormatPayload;
        }
        if (postFormatPayloadToUse) {
            try {
                const compiledPostFormat = Handlebars.compile(postFormatPayloadToUse);
                const processedPostFormat = compiledPostFormat(Object.assign(conversationStateObject, { textResponse: data.textResponse }));
                const processedPostFormatJson = JSON.parse(processedPostFormat);
                processedPostFormatJson.docId = data.docId;
                if (!processedPostFormatJson.textResponse) {
                    processedPostFormatJson.textResponse = data.textResponse;
                }
                return reply(processedPostFormatJson);
            }
            catch (error) {
                const errorMessage = usedPostFormatAction ? 'Error formatting the post response using action POST format : ' : 'Error formatting the post response using agent POST format : ';
                console.log(errorMessage, error);
                return reply(Object.assign({
                    postFormating: errorMessage + error
                }, data));
            }

        }
        else {
            return reply(data);
        }

    });
};
