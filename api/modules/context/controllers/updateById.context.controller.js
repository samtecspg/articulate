'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
const _ = require('lodash');

const redis = require('redis');

module.exports = (request, reply) => {

    const contextId = request.params.id;
    const sessionId = request.params.sessionId;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;
    
    Async.waterfall([
        (cb) => {
            
            redis.lrange(`sessionContexts:${sessionId}`, 0, -1, (err, contextElements) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred retrieving the context of this session');
                    return cb(error, null);
                }
                if (contextElements.length > 0){
                    if (contextElements.indexOf(contextId) > -1){
                        return cb(null);
                    }
                    else {
                        const error = Boom.notFound('This context element doesn\'t exists in this session');
                        return cb(error, null);
                    }
                }
                else {
                    const error = Boom.notFound('This session doesn\'t have a context');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.hgetall(`context:${contextId}`, (err, data) => {
                
                if (err){
                    const error = Boom.badImplementation(`An error ocurred retrieving the context ${contextId}.`);
                    return cb(error);
                }
                if (data){
                    return cb(null, Flat.unflatten(data));
                }
                else {
                    const error = Boom.notFound(`The context ${contextId} doesn\'t exists`);
                    return cb(error);                    
                }
            });
        },
        (currentContext, cb) => {

            redis.del(`context:${contextId}`, (err) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred temporaly removing the scenario for the update.');
                    return cb(error);
                }
                return cb(null, currentContext);
            });
        },
        (currentContext, cb) => {

            currentContext.slots = updateData.slots;
            const flatContextElement = Flat(currentContext);
            const flatUpdateData = Flat(updateData);
            Object.keys(flatUpdateData).forEach( (key) => {
                flatContextElement[key] = flatUpdateData[key]; 
            });
            redis.hmset(`context:${contextId}`, flatContextElement, (err) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the scenario data.');
                    return cb(error);
                }
                return cb(null, Flat.unflatten(flatContextElement));
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};
