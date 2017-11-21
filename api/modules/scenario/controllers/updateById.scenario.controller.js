'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const _ = require('lodash');
const ScenarioTools = require('../tools');

const redis = require('redis');

const updateDataFunction = (redis, scenarioId, currentScenario, updateData, cb) => {

    if(updateData.slots){
        currentScenario.slots = updateData.slots;
    }
    if(updateData.intentResponses){
        currentScenario.intentResponses = updateData.intentResponses;
    }
    const flatScenario = Flat(currentScenario);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatScenario[key] = flatUpdateData[key]; 
    });
    redis.del(`scenario:${scenarioId}`, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred temporaly removing the scenario for the update.');
            return cb(error);
        }
        redis.hmset(`scenario:${scenarioId}`, flatScenario, (err) => {
            
            if (err){
                const error = Boom.badImplementation('An error ocurred adding the scenario data.');
                return cb(error);
            }
            return cb(null, Flat.unflatten(flatScenario));
        });
    });
}

module.exports = (request, reply) => {

    const scenarioId = request.params.id;
    const updateData = request.payload;

    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/scenario/${scenarioId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified scenario doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the scenario ${scenarioId}`);
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
                                const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (agentId){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`The agent ${scenario.agent} doesn't exist`);
                                return callback(error, null);
                            }
                        });
                    },
                    (agentId, callback) => {

                        ScenarioTools.validateEntitiesTool(redis, agentId, updateData.slots, (err) => {
                            
                            if (err) {
                                return callback(err);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, scenarioId, currentScenario, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the scenario data.');
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
                updateDataFunction(redis, scenarioId, currentScenario, updateData, (err, result) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the scenario data.');
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
