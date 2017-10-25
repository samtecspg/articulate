'use strict';
const Async = require('async');
const AgentTools = require('../tools');

module.exports = (request, reply) => {

    Async.waterfall([
        Async.apply(AgentTools.getAvailableDomains, request.server, request.params.id, null),
        (domains, callback) => {

            Async.parallel({
                parseResult: (cb) => {

                    AgentTools.parseText(request.server, request.query.text, request.query.timezone, domains, cb);
                },
                agentData: (cb) => {

                    AgentTools.loadAgentData(request.server.app.elasticsearch, request.params.id, cb);
                }
            }, (errParallel, results) => {

                if (errParallel){
                    return callback(err, null);
                }
                return callback(null, results);
            });
        },
        Async.apply(AgentTools.respond, request.query.timezone)
    ], (err, data) => {

        if (err){
            return reply(err);
        }

        return reply(data);
    });
};
