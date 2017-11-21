'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

module.exports = (request, reply) => {

    const entityId = request.params.id;
    let entity;
    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/entity/${entityId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified entity doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the entity ${entityId}`);
                    return cb(error, null);
                }
                entity = res.result;
                return cb(null);
            });
        },
        (callbackCheckEntityNotInUse) => {
            
            redis.smembers(`entityDomain:${entity.id}`, (err, domains) => {

                if (err){
                    const error = Boom.badImplementation(`An error ocurred deleting the entity ${entityId} from the entity ${entityId}`);
                    return callbackCheckEntityNotInUse(error, null);
                }
                if (domains && domains.length > 0){
                    const error = Boom.badRequest(`The entity ${entityId} is being used by the domain(s) ${domains}`);
                    return callbackCheckEntityNotInUse(error, null);
                }
                return callbackCheckEntityNotInUse(null);
            })
        },
        (callbackDeleteEntityAndReferences) => {

            Async.parallel([
                (callbackDeleteEntity) => {

                    redis.del(`entity:${entityId}`, (err, result) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred deleting the entity ${entityId} from the entity ${entityId}`);
                            return callbackDeleteEntity(error, null);
                        }
                        return callbackDeleteEntity(null);
                    });
                },
                (callbackDeleteEntityDomainsLists) => {

                    redis.del(`entityDomains:${entityId}`, (err, result) => {
                        
                        if (err){
                            const error = Boom.badImplementation(`An error ocurred deleting the domains list from the entity ${entityId}`);
                            return callbackDeleteEntityDomainsLists(error, null);
                        }
                        return callbackDeleteEntityDomainsLists(null);
                    });
                },
                (callbackDeleteEntityFromTheAgent) => {
                    
                    Async.waterfall([
                        (callbackGetAgent) => {

                            redis.zscore(`agents`, entity.agent, (err, agentId) => {
                                
                                if (err){
                                    const error = Boom.badImplementation( `An error ocurred retrieving the id of the agent ${agent}`);
                                    return callbackGetAgent(error);
                                }
                                return callbackGetAgent(null, agentId);
                            });
                        },
                        (agentId, callbackRemoveFromAgentsList) => {

                            redis.zrem(`agentEntities:${agentId}`, entity.entityName, (err, removeResult) => {
                                
                                if (err){
                                    const error = Boom.badImplementation( `An error ocurred removing the entity ${entityId} from the entities list of the agent ${agentId}`);
                                    return callbackRemoveFromAgentsList(error);
                                }
                                return callbackRemoveFromAgentsList(null);
                            });
                        }
                    ], (err, result) => {
                        
                        if (err){
                            return callbackDeleteEntityFromTheAgent(err);
                        }
                        return callbackDeleteEntityFromTheAgent(null);                        
                    })
                },
            ], (err, result) => {
                
                if (err){
                    return callbackDeleteEntityAndReferences(err);
                }
                return callbackDeleteEntityAndReferences(null);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply({ message: 'successful operation' }).code(200);
    });
};
