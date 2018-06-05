'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const ScenarioTools = require('../tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let agentId = null;
    let domainId = null;
    let intentId = null;
    let scenario = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        fathersCheck: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', scenario.agent, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id){
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${scenario.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    redis.zscore(`agentDomains:${agentId}`, scenario.domain, (err, id) => {

                        if (err){
                            const error = Boom.badImplementation(`An error occurred checking if the domain ${scenario.domain} exists in the agent ${scenario.agent}.`);
                            return callback(error);
                        }
                        if (id){
                            domainId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The domain ${scenario.domain} doesn't exist in the agent ${scenario.agent}`);
                        return callback(error);
                    });
                },
                (callback) => {

                    Async.parallel([
                        (cllbk) => {

                            redis.zscore(`domainIntents:${domainId}`, scenario.intent, (err, id) => {

                                if (err){
                                    const error = Boom.badImplementation(`An error occurred checking if the intent ${scenario.intent} exists in the domain ${scenario.domain}.`);
                                    return cllbk(error);
                                }
                                if (id){
                                    intentId = id;
                                    return cllbk(null);
                                }
                                const error = Boom.badRequest(`The intent ${scenario.intent} doesn't exist in the domain ${scenario.domain}`);
                                return cllbk(error);
                            });
                        },
                        (cllbk) => {

                            ScenarioTools.validateEntitiesScenarioTool(redis, agentId, scenario.slots, (err) => {

                                if (err) {
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        }
                    ], (err, result) => {

                        if (err){
                            return callback(err);
                        }
                        return callback(null);
                    });
                },
                (callback) => {

                    redis.exists(`scenario:${intentId}`, (err, exists) => {

                        if (err){
                            const error = Boom.badImplementation('An error occurred retrieving the scenario.');
                            return cb(error);
                        }
                        if (exists){
                            const error = Boom.badRequest('An scenario already exists for this intent. If you want to change it please use the update endpoint.');
                            return cb(error);
                        }
                        return cb(null);
                    });
                }
            ], (err) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null);
            });
        },
        scenario: (cb) => {

            scenario = Object.assign({ id: intentId }, scenario);
            const flatScenario = RemoveBlankArray(Flat(scenario));
            redis.hmset(`scenario:${intentId}`, flatScenario, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the scenario data.');
                    return cb(error);
                }
                return cb(null, scenario);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result.scenario);
    });
};
