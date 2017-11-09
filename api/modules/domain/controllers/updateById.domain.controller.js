'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');

const redis = require('redis');

const updateDataFunction = (redis, domainId, currentDomain, updateData, cb) => {

    const flatDomain = Flat(currentDomain);
    const flatUpdateData = Flat(updateData);
    Object.keys(flatUpdateData).forEach( (key) => {
        flatDomain[key] = flatUpdateData[key]; 
    });
    redis.hmset(`domain:${domainId}`, flatDomain, (err) => {
        
        if (err){
            const error = Boom.badImplementation('An error ocurred adding the domain data.');
            return cb(error);
        }
        return cb(null, Flat.unflatten(flatDomain));
    });
}

module.exports = (request, reply) => {

    const domainId = request.params.id;
    const updateData = request.payload;

    const redis = request.server.app.redis;
    const server = request.server;
    
    Async.waterfall([
        (cb) => {
            
            server.inject(`/domain/${domainId}`, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, `An error ocurred getting the data of the domain ${domainId}`);
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        (currentDomain, cb) => {

            if (updateData.domainName && updateData.domainName !== currentDomain.domainName){
                Async.waterfall([
                    (callback) => {

                        redis.zscore('agents', currentDomain.agent, (err, agentId) => {
                            
                            if (err){
                                const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                                return callback(error);
                            }
                            if (agentId){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`The agent ${domain.agent} doesn't exist`);
                                return callback(error, null);
                            }
                        });
                    },
                    (agentId, callback) => {

                        redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, updateData.domainName, (err, addResponse) => {
                            
                            if (err){
                                const error = Boom.badImplementation(`An error ocurred adding the name ${currentDomain.domainName} to the domains list of the agent ${currentDomain.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null, agentId);
                            }
                            else{
                                const error = Boom.badRequest(`A domain with this name already exists in the agent ${currentDomain.agent}.`);
                                return callback(error, null);
                            }
                        });
                    },
                    (agentId, callback) => {
                        
                        redis.zrem(`agentDomains:${agentId}`, currentDomain.domainName, (err, addResponse) => {
                            
                            if (err){
                                const error = Boom.badImplementation( `An error ocurred removing the name ${currentDomain.domainName} from the domains list of the agent ${currentDomain.agent}.`);
                                return callback(error);
                            }
                            if (addResponse !== 0){
                                return callback(null);
                            }
                            else{
                                const error = Boom.badRequest(`A domain with this name already exists in the agent ${domain.agent}.`);
                                return callback(error, null);
                            }
                        });
                    },
                    (callback) => {

                        updateDataFunction(redis, domainId, currentDomain, updateData, (err, result) => {

                            if (err){
                                const error = Boom.badImplementation('An error ocurred adding the domain data.');
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
                updateDataFunction(redis, domainId, currentDomain, updateData, (err, result) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the domain data.');
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
