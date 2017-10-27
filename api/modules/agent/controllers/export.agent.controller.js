'use strict';
const Async = require('async');
const AgentTools = require('../tools');

module.exports = (request, reply) => {

    Async.waterfall([
        Async.apply(AgentTools.loadAgentData, request.server.app.elasticsearch, request.params.id),
        Async.apply(AgentTools.formatOutputData)
    ], (err, data) => {

        if (err){
            return reply(err);
        }

        return reply(data);
    });

};
