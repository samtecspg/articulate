'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let agentId = null;
    let agent = request.payload;
    let globalSettings = {};

    const server = request.server;
    const redis = server.app.redis;

    Async.series({
        agentId: (cb) => {

            redis.incr('agentId', (err, newAgentId) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the new agent id.');
                    return cb(error);
                }
                agentId = newAgentId;
                return cb(null);
            });
        },
        addNameToList: (cb) => {

            redis.zadd('agents', 'NX', agentId, agent.agentName, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the agents list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }

                const error = Boom.badRequest('An agent with this name already exists.');
                return cb(error, null);
            });
        },
        agent: (cb) => {

            agent = Object.assign({ id: agentId }, agent);
            agent.status = Status.ready;
            agent.enableModelsPerDomain = agent.enableModelsPerDomain !== undefined ? agent.enableModelsPerDomain : true;
            const flatAgent = RemoveBlankArray(Flat(agent));
            redis.hmset('agent:' + agentId, flatAgent, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the agent data.');
                    return cb(error);
                }
                return cb(null, agent);
            });
        },
        getGlobalSettings: (cb) => {

            server.inject('/settings', (res) => {

                if (res.statusCode !== 200) {
                    const error = Boom.create(res.statusCode, 'An error occurred getting the global settings');
                    return cb(error, null);
                }
                globalSettings = res.result;
                return cb(null);
            });
        },
        setDefaultSettings: (cb) => {

            const {
                rasaURL,
                ducklingURL,
                ducklingDimension,
                spacyPretrainedEntities,
                domainClassifierPipeline,
                intentClassifierPipeline,
                entityClassifierPipeline
            } = globalSettings;
            server.inject({
                method: 'PUT',
                url: `/agent/${agentId}/settings`,
                payload: {
                    rasaURL,
                    ducklingURL,
                    ducklingDimension,
                    spacyPretrainedEntities,
                    domainClassifierPipeline,
                    intentClassifierPipeline,
                    entityClassifierPipeline
                }
            }, (res) => {

                if (res.statusCode !== 200) {
                    const error = Boom.create(res.statusCode, 'An error occurred adding the settings of the agent');
                    return cb(error, null);
                }
                return cb(null);
            });
        }
    }, (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result.agent);
    });
};
