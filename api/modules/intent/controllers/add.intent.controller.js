'use strict';
const _ = require('lodash');
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const IntentTools = require('../tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let intentId = null;
    let agentId = null;
    let domainId = null;
    let intent = request.payload;
    const server = request.server;
    const redis = server.app.redis;

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

            Async.eachSeries(intent.examples, (example, nextIntent) => {

                Async.eachSeries(example.entities, (entity, nextEntity) => {

                    //Only system entities have an extractor specified, so ignore sys entities
                    if (entity.extractor){
                        return nextEntity(null);
                    }
                    redis.zadd(`entityIntents:${entity.entityId}`, 'NX', intentId, intent.intentName, (err, addResponse) => {

                        if (err) {
                            const error = Boom.badImplementation('An error occurred adding the intent to the entity list.');
                            return nextEntity(error);
                        }
                        return nextEntity(null);
                    });
                }, nextIntent);
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
            const flatIntent = RemoveBlankArray(Flat(intent));
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

        IntentTools.updateEntitiesDomainTool(server, redis, resultIntent, agentId, domainId, null, (err) => {

            if (err) {
                return reply(err);
            }
            redis.hmset(`agent:${agentId}`, { status: Status.outOfDate }, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred updating the agent status.');
                    return reply(error);
                }
                redis.hmset(`domain:${domainId}`, { status: Status.outOfDate }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred updating the domain status.');
                        return reply(error);
                    }
                    return reply(resultIntent);
                });
            });
        });
    });
};
