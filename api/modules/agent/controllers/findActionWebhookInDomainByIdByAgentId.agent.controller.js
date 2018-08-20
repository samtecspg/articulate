'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');

'use strict';

module.exports = (request, reply) => {

    return reply(null, request.plugins['flow-loader']);
};

module.lol = (request, reply) => {

    const server = request.server;
    const agentId = request.params.id;
    const domainId = request.params.domainId;
    const actionId = request.params.actionId;
    let agentName;
    let domainName;

    Async.waterfall([
        (cb) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
                    return cb(error, null);
                }
                agentName = res.result.agentName;
                return cb(null);
            });
        },
        (cb) => {

            server.inject(`/agent/${agentId}/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified domain doesn\'t exists in this agent');
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the domain');
                    return cb(error, null);
                }
                domainName = res.result.domainName;
                return cb(null);
            });
        },
        (cb) => {

            server.inject(`/action/${actionId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified action doesn\'t exists');
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the action');
                    return cb(error, null);
                }
                if (res.result && res.result.agent && res.result.agent === agentName && res.result.domain && res.result.domain === domainName){
                    return cb(null);
                }
                const errorNotFoundInDomain = Boom.badRequest('The specified action is not linked with this domain');
                return cb(errorNotFoundInDomain);
            });
        },
        (cb) => {

            server.inject(`/action/${actionId}/webhook`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified webhook doesn\'t exists');
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the webhook');
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(Cast(result, 'webhook'));
    });
};
