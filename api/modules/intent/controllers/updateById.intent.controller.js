'use strict';
const Async = require('async');
const Boom = require('boom');
const Cast = require('../../../helpers/cast');
const Flat = require('flat');
const IntentTools = require('../tools');
const DomainTools = require('../../domain/tools');
const _ = require('lodash');

const updateDataFunction = (redis, server, rasa, intentId, currentIntent, updateData, agent, agentId, domainId, cb) => {

    const oldExamples = _.cloneDeep(currentIntent.examples);
    if (updateData.examples){
        currentIntent.examples = updateData.examples;
    }
    currentIntent.examples = _.map(currentIntent.examples, (example) => {

        if (example.entities && example.entities.length > 0) {

            const entities = _.sortBy(example.entities, (entity) => {

                return entity.start;
            });
            example.entities = entities;
        }
        return example;
    });
    const flatIntent = Flat(currentIntent);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatIntent[key] = flatUpdateData[key];
    });

    redis.del(`intent:${intentId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporaly removing the intent for the update.');
            return cb(error);
        }
        redis.hmset(`intent:${intentId}`, flatIntent, (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the intent data.');
                return cb(error);
            }
            const resultIntent = Flat.unflatten(flatIntent);
            let requiresTraining = false;
            if (updateData.examples){
                requiresTraining = !_.isEqual(updateData.examples, oldExamples);
            }
            if (updateData.intentName){
                requiresTraining =  requiresTraining || updateData.intentName !== currentIntent.intentName;
            }
            if (requiresTraining){
                Async.series([
                    Async.apply(IntentTools.updateEntitiesDomainTool, redis, resultIntent, agentId, domainId, oldExamples),
                    (callback) => {

                        Async.waterfall([
                            Async.apply(DomainTools.retrainModelTool, server, rasa, agent.language, resultIntent.agent, resultIntent.domain, domainId),
                            Async.apply(DomainTools.retrainDomainRecognizerTool, server, redis, rasa, agent.language, resultIntent.agent, agentId)
                        ], (err) => {

                            if (err){
                                return callback(err);
                            }
                            return callback(null);
                        });
                    }
                ], (err) => {

                    if (err) {
                        return cb(err);
                    }

                    return cb(null, resultIntent);
                });

            }
            else {
                return cb(null, resultIntent);
            }
        });
    });
};

module.exports = (request, reply) => {

    const intentId = request.params.id;
    let agent = null;
    let agentId = null;
    let domainId = null;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;
    const rasa = server.app.rasa;

    Async.waterfall([
        (cb) => {

            server.inject(`/intent/${intentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified intent doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the intent ${intentId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentIntent, cb) => {

            redis.zscore('agents', currentIntent.agent, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the agent.');
                    return cb(error);
                }
                if (id){
                    agentId = id;
                    return cb(null, currentIntent);
                }
                const error = Boom.badRequest(`The agent ${currentIntent.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentIntent, cb) => {

            server.inject(`/agent/${agentId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 400){
                        const errorNotFound = Boom.notFound(res.result.message);
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred get the agent data');
                    return cb(error, null);
                }
                agent = res.result;
                return cb(null, currentIntent);
            });
        },
        (currentIntent, cb) => {

            redis.zscore(`agentDomains:${agentId}`, currentIntent.domain, (err, id) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the id of the domain.');
                    return cb(error);
                }
                if (id){
                    domainId = id;
                    return cb(null, currentIntent);
                }
                const error = Boom.badRequest(`The domain ${currentIntent.domain} doesn't exist`);
                return cb(error, null);
            });
        },
        (currentIntent, cb) => {

            if (updateData.examples){
                IntentTools.validateEntitiesTool(redis, agentId, updateData.examples, (err) => {

                    if (err) {
                        return cb(err);
                    }
                    return cb(null, currentIntent);
                });
            }
            else {
                return cb(null, currentIntent);
            }
        },
        (currentIntent, cb) => {

            if (updateData.intentName && updateData.intentName !== currentIntent.intentName){
                Async.waterfall([
                    (callback) => {

                        redis.zadd(`domainIntents:${domainId}`, 'NX', intentId, updateData.intentName, (err, addResponse) => {

                            if (err) {
                                const error = Boom.badImplementation(`An error occurred adding the name ${updateData.intentName} to the intents list of the domain ${currentIntent.domain}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            const error = Boom.badRequest(`A intent with the name ${updateData.intentName} already exists in the domain ${currentIntent.domain}.`);
                            return callback(error, null);
                        });
                    },
                    (callback) => {

                        redis.zrem(`domainIntents:${domainId}`, currentIntent.intentName, (err) => {

                            if (err){
                                const error = Boom.badImplementation( `An error occurred removing the name ${currentIntent.intentName} from the intents list of the agent ${currentIntent.agent}.`);
                                return callback(error);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, server, rasa, intentId, currentIntent, updateData, agent, agentId, domainId, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the intent data.');
                                return callback(error);
                            }
                            return callback(null, result);
                        });
                    }
                ], (err, result) => {

                    if (err){
                        return cb(err);
                    }
                    return cb(null, result);
                });
            }
            else {
                updateDataFunction(redis, server, rasa, intentId, currentIntent, updateData, agent, agentId, domainId, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the intent data.');
                        return cb(error);
                    }
                    return cb(null, result);
                });
            }
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }

        redis.exists(`scenario:${result.id}`, (err, exists) => {

            if (err){
                const error = Boom.badImplementation('Intent updated. An error occurred checking if the scenario exists.');
                return reply(error);
            }
            if (exists){
                redis.hmset(`scenario:${result.id}`, { intent: result.intentName }, (err) => {

                    if (err){
                        const error = Boom.badImplementation('Intent updated. An error occurred updating the new values in the scenario of the intent.');
                        return reply(error);
                    }
                    return reply(Cast(result, 'intent'));
                });
            }
            else {
                return reply(Cast(result, 'intent'));
            }
        });
    });
};
