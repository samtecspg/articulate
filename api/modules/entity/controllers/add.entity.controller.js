'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
    
module.exports = (request, reply) => {

    let entityId = null;
    let entity = request.payload;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {
            
            redis.exists(`agent:${entity.agent}`, (err, agentExist) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                    return cb(error);
                }
                return cb(null, agentExist);
            });
        },
        (agentExist, cb) => {
            
            if (agentExist){
                redis.incr('entityId', (err, newEntityId) => {
                    if (err){
                        const error = Boom.badImplementation('An error ocurred getting the new entity id.');
                        return cb(error);
                    }
                    entityId = newEntityId;
                    return cb(null);
                });
            }
            else{
                const error = Boom.badRequest(`The agent with the id ${entity.agent} doesn't exist`);
                return cb(error, null);
            }
        },
        (cb) => {

            redis.zadd(`agentEntities:${entity.agent}`, 'NX', entityId, entity.entityName, (err, addResponse) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the entities list.');
                    return cb(error);
                }
                return cb(null, addResponse);
            });
        },
        (addResponse, cb) => {

            if (addResponse !== 0){
                entity = Object.assign({id: entityId}, entity);          
                const flatEntity = Flat(entity);  
                redis.hmset(`entity:${entityId}`, flatEntity, (err) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the entity data.');
                        return cb(error);
                    }
                    return cb(null, entity);
                });
            }
            else{
                const error = Boom.badRequest(`A entity with this name already exists in the agent ${entity.agent}.`);
                return cb(error, null);
            }
        }
    ], (err, result) => {
        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};