'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const ScenarioTools = require('../tools');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

const updateDataFunction = (redis, sayingId, currentScenario, updateData, cb) => {

    if (updateData.slots){
        currentScenario.slots = updateData.slots;
    }
    if (updateData.sayingResponses){
        currentScenario.sayingResponses = updateData.sayingResponses;
    }
    const flatScenario = Flat(currentScenario);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {

        flatScenario[key] = flatUpdateData[key];
    });
    redis.del(`scenario:${sayingId}`, (err) => {

        if (err){
            const error = Boom.badImplementation('An error occurred temporarily removing the scenario for the update.');
            return cb(error);
        }
        redis.hmset(`scenario:${sayingId}`, RemoveBlankArray(flatScenario), (err) => {

            if (err){
                const error = Boom.badImplementation('An error occurred adding the scenario data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatScenario));
        });
    });
};

module.exports = (request, reply) => {

    const sayingId = request.params.id;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            server.inject(`/saying/${sayingId}/scenario`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified scenario doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error occurred getting the data of the scenario ${sayingId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentScenario, cb) => {

            if (updateData.slots){
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentScenario.agent, (err, agentId) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (agentId){
                                return callback(null, agentId);
                            }
                            const error = Boom.badRequest(`The agent ${currentScenario.agent} doesn't exist`);
                            return callback(error, null);
                        });
                    },
                    (agentId, callback) => {

                        ScenarioTools.validateKeywordsScenarioTool(redis, agentId, updateData.slots, (err) => {

                            if (err) {
                                return callback(err);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, sayingId, currentScenario, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error occurred adding the scenario data.');
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
                updateDataFunction(redis, sayingId, currentScenario, updateData, (err, result) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred adding the scenario data.');
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
        return reply(result);
    });
};
