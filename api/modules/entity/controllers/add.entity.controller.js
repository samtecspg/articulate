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
            
            redis.zscore('agents', entity.agent, (err, agentId) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                    return cb(error);
                }
                if (agentId){
                    return cb(null, agentId);
                }
                else{
                    const error = Boom.badRequest(`The agent ${entity.agent} doesn't exist`);
                    return cb(error, null);
                }
            });
        },
        (agentId, cb) => {
            
            redis.incr('entityId', (err, newEntityId) => {
                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new entity id.');
                    return cb(error);
                }
                entityId = newEntityId;
                return cb(null, agentId);
            });
        },
        (agentId, cb) => {

            redis.zadd(`agentEntities:${agentId}`, 'NX', entityId, entity.entityName, (err, addResponse) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the entities list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                else{
                    const error = Boom.badRequest(`A entity with this name already exists in the agent ${entity.agent}.`);
                    return cb(error);
                }
            });
        },
        (cb) => {

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
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};