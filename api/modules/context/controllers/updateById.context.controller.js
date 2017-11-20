'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const _ = require('lodash');
const ContextTools = require('../tools');

const redis = require('redis');

const updateDataFunction = (redis, contextId, currentContext, updateData, cb) => {

    const flatContext = Flat(currentContext);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatContext[key] = flatUpdateData[key]; 
    });
    redis.hmset(`context:${contextId}`, flatContext, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred adding the context data.');
            return cb(error);
        }
        return cb(null, Flat.unflatten(flatContext));
    });
}

module.exports = (request, reply) => {

    const contextId = request.params.id;
    const updateData = request.payload;

    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/context/${contextId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified context doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the context ${contextId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentContext, cb) => {

            if (updateData.slots){
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentContext.agent, (err, agentId) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (agentId){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`The agent ${context.agent} doesn't exist`);
                                return callback(error, null);
                            }
                        });
                    },
                    (agentId, callback) => {

                        ContextTools.validateEntitiesTool(redis, agentId, updateData.slots, (err) => {
                            
                            if (err) {
                                return callback(err);
                            }
                            return callback(null);
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, contextId, currentContext, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the context data.');
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
                updateDataFunction(redis, contextId, currentContext, updateData, (err, result) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the context data.');
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
