'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let entityId = null;
    let entity = request.payload;
    const redis = request.server.app.redis;

    if (entity.entityName.startsWith('sys.')){
        const error = Boom.badRequest('\'sys.\' is a reserved prefix for system entities. Please use another entity name');
        return reply(error, null);
    }
    Async.waterfall([
        (cb) => {

            redis.zscore('agents', entity.agent, (err, agentId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                    return cb(error);
                }
                if (agentId){
                    return cb(null, agentId);
                }
                const error = Boom.badRequest(`The agent ${entity.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (agentId, cb) => {

            redis.incr('entityId', (err, newEntityId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the new entity id.');
                    return cb(error);
                }
                entityId = newEntityId;
                return cb(null, agentId);
            });
        },
        (agentId, cb) => {

            redis.zadd(`agentEntities:${agentId}`, 'NX', entityId, entity.entityName, (err, addResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the name to the entities list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                const error = Boom.badRequest(`A entity with this name already exists in the agent ${entity.agent}.`);
                return cb(error);
            });
        },
        (cb) => {

            entity = Object.assign({ id: entityId }, entity);
            const flatEntity = RemoveBlankArray(Flat(entity));
            if (!entity.regex){
                entity.regex = null;
                flatEntity.regex = '';
            }
            redis.hmset(`entity:${entityId}`, flatEntity, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the entity data.');
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
