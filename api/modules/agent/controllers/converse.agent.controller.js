'use strict';
const Async = require('async');
const AgentTools = require('../tools');
const Boom = require('boom');
const Handlebars = require('handlebars');
const RegisterHandlebarHelpers = require('../../../helpers/registerHandlebarsHelpers.js');


module.exports = (request, reply) => {
    RegisterHandlebarHelpers(Handlebars);
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
                parse: (cb) => {

                    server.inject(`/agent/${agentId}/parse?text=${text}&${(timezone ? 'timezone=' + timezone : '')}`, (res) => {

                        if (res.statusCode !== 200){
                            if (res.statusCode === 404){
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

                    server.inject(`/agent/${agentId}/export?withReferences=true`, (res) => {

                        if (res.statusCode !== 200){
                            if (res.statusCode === 400){
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

                        if (res.statusCode !== 200){
                            const error = Boom.create(res.statusCode, `An error occurred getting the context of the session ${sessionId}`);
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
        (conversationStateObject, callback) => {

            const timezoneToUse = timezone ? timezone : (conversationStateObject.agent.timezone ? conversationStateObject.agent.timezone : 'UTC');
            conversationStateObject.text = text;
            conversationStateObject.sessionId = sessionId;
            conversationStateObject.timezone = timezoneToUse;
            if (request.payload){
                Object.keys(request.payload).forEach( (key) => {

                    if (!conversationStateObject[key]){
                        conversationStateObject[key] = request.payload[key];
                    }
                    else {
                        if (['text', 'timezone', 'sessionId'].indexOf(key) === -1){
                            console.error(`POST value {{${key}}} overwritten by Articulate. {{${key}}} is a reserved keyword.`);
                        }
                    }
                });
            }
            AgentTools.respond(server, conversationStateObject, (err, result) => {

                if (err){
                    return callback(err, null,null);
                }
                return callback(null, result, conversationStateObject);
            });
        }
    ], (err, data, conversationStateObject) => {

        if (err){
            return reply(err);
        }
        const compiledPostFormat = Handlebars.compile(conversationStateObject.agent.postFormat.postFormatPayload); 
        //let dd = {...conversationStateObject,textResponse: data.textResponse};
        const processedPostFormat = compiledPostFormat(Object.assign(conversationStateObject,{textResponse: data.textResponse}));
        let processedPostFormatJson = {};
        try {
             processedPostFormatJson = JSON.parse(processedPostFormat);
        } catch (error) {
            console.log('Error formatting the post response: ', error);
        return reply({
            textResponse: data.textResponse,
            postFormating: 'Error formatting the post response: ' + error
        });
        }
        if (! processedPostFormatJson.textResponse){
            processedPostFormatJson.textResponse = data.textResponse
        }
        return reply(processedPostFormatJson);

    });
};
