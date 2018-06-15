'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const DomainTools = require('../tools');

module.exports = (request, reply) => {

    let agent = null;
    let agentId = null;
    let domain = null;
    let rasa = null;
    const domainId = request.params.id;
    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (callback) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound(res.result.message);
                        return callback(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the domain');
                    return callback(error, null);
                }
                domain = res.result;
                return callback(null);
            });
        },
        (callback) => {

            redis.zscore('agents', domain.agent, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                    return callback(error);
                }
                if (id){
                    agentId = id;
                    return callback(null);
                }
                const error = Boom.badRequest(`The agent ${domain.agent} of the specified domain doesn't exist`);
                return callback(error);
            });
        },
        (callback) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 400){
                        const errorNotFound = Boom.notFound(res.result.message);
                        return callback(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                    return callback(error, null);
                }
                agent = res.result;
                return callback(null);
            });
        },
        (callback) => {

            server.inject(`/agent/${agentId}/settings/rasaURL`, (res) => {

                if (res.statusCode !== 200) {
                    if (res.statusCode === 404) {
                        const errorNotFound = Boom.notFound('The setting rasaURL wasn\'t found');
                        return callback(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the setting rasaURL');
                    return callback(error, null);
                }
                rasa = res.result;
                return callback(null);
            });
        },
        (callback) => {

            DomainTools.retrainModelTool(server, rasa, agent.language, domain.agent, agent.id, domain.domainName, domainId, domain.extraTrainingData, (err) => {

                if (err) {
                    return callback(err);
                }
                return callback(null);
            });
        }
    ], (err) => {

        if (err){
            return reply(err);
        }
        server.inject(`/domain/${domainId}`, (res) => {

            if (res.statusCode !== 200){
                const error = Boom.create(res.statusCode, 'An error occurred getting the domain after training');
                return reply(error);
            }
            return reply(Cast(res.result, 'domain'));
        });
    });
};
