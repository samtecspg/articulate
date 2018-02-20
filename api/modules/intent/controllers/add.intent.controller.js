'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const IntentTools = require('../tools');
const DomainTools = require('../../domain/tools');

module.exports = (request, reply) => {

    let intentId = null;
    let agent = null;
    let agentId = null;
    let domainId = null;
    let intent = request.payload;
    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;

    Async.series({
        fathersCheck: (cb) => {

            Async.series([
                (callback) => {

                    redis.zscore('agents', intent.agent, (err, id) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                            return callback(error);
                        }
                        if (id) {
                            agentId = id;
                            return callback(null);
                        }
                        const error = Boom.badRequest(`The agent ${intent.agent} doesn't exist`);
                        return callback(error, null);
                    });
                },
                (callback) => {

                    server.inject(`/agent/${agentId}`, (res) => {

                        if (res.statusCode !== 200) {
                            if (res.statusCode === 400) {
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

                    Async.parallel([
                        (cllbk) => {

                            redis.zscore(`agentDomains:${agentId}`, intent.domain, (err, id) => {

                                if (err) {
                                    const error = Boom.badImplementation(`An error occurred checking if the domain ${intent.domain} exists in the agent ${intent.agent}.`);
                                    return cllbk(error);
                                }
                                if (id) {
                                    domainId = id;
                                    return cllbk(null);
                                }
                                const error = Boom.badRequest(`The domain ${intent.domain} doesn't exist in the agent ${intent.agent}`);
                                return cllbk(error);
                            });
                        },
                        (cllbk) => {

                            IntentTools.validateEntitiesTool(redis, agentId, intent.examples, (err) => {

                                if (err) {
                                    return cllbk(err);
                                }
                                return cllbk(null);
                            });
                        }
                    ], (err, result) => {

                        if (err) {
                            return callback(err);
                        }
                        return callback(null);
                    });
                }
            ], (err) => {

                if (err) {
                    return cb(err, null);
                }
                return cb(null);
            });
        },
        intentId: (cb) => {

            redis.incr('intentId', (err, newIntentId) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the new intent id.');
                    return cb(error);
                }
                intentId = newIntentId;
                return cb(null);
            });
        },
        addToDomain: (cb) => {

            redis.zadd(`domainIntents:${domainId}`, 'NX', intentId, intent.intentName, (err, addResponse) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the name to the intents list.');
                    return cb(error);
                }
                if (addResponse !== 0) {
                    return cb(null);
                }
                const error = Boom.badRequest(`A intent with this name already exists in the domain ${intent.domain}.`);
                return cb(error);
            });
        },
        addToEntities: (cb) => {
            Async.eachSeries(intent.examples, (example, next) => {
                Async.eachSeries(example.entities, (entity, next) => {
                    redis.zadd(`entityIntents:${entity.entityId}`, 'NX', intentId, intent.intentName, (err, addResponse) => {
                        if (err) {
                            const error = Boom.badImplementation('An error occurred adding the intent to the entity list.');
                            return next(error);
                        }
                        return next(null);
                    });
                }, next);

            }, cb);
        },
        intent: (cb) => {

            intent = Object.assign({ id: intentId }, intent);
            intent.examples = _.map(intent.examples, (example) => {

                if (example.entities && example.entities.length > 0) {

                    const entities = _.sortBy(example.entities, (entity) => {

                        return entity.start;
                    });
                    example.entities = entities;
                }
                return example;
            });
            const flatIntent = Flat(intent);
            redis.hmset(`intent:${intentId}`, flatIntent, (err) => {

                if (err) {
                    const error = Boom.badImplementation('An error occurred adding the intent data.');
                    return cb(error);
                }
                return cb(null, intent);
            });
        }
    }, (err, result) => {

        if (err) {
            return reply(err, null);
        }

        const resultIntent = result.intent;

        Async.series([
            Async.apply(IntentTools.updateEntitiesDomainTool, redis, resultIntent, agentId, domainId, null),
            (cb) => {

                Async.waterfall([
                    Async.apply(DomainTools.retrainModelTool, server, rasa, agent.language, resultIntent.agent, resultIntent.domain, domainId),
                    Async.apply(DomainTools.retrainDomainRecognizerTool, server, redis, rasa, agent.language, resultIntent.agent, agentId)
                ], (err) => {

                    if (err) {
                        return cb(err);
                    }
                    return cb(null);
                });
            }
        ], (err) => {

            if (err) {
                return reply(err);
            }
            return reply(null, resultIntent);
        });
    });
};
