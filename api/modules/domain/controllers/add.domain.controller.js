'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
    
module.exports = (request, reply) => {

    let domainId = null;
    let domain = request.payload;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {
            
            redis.exists(`agent:${domain.agent}`, (err, agentExist) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred checking if the agent exists.');
                    return cb(error);
                }
                return cb(null, agentExist);
            });
        },
        (agentExist, cb) => {
            
            if (agentExist){
                redis.incr('domainId', (err, newDomainId) => {
                    if (err){
                        const error = Boom.badImplementation('An error ocurred getting the new domain id.');
                        return cb(error);
                    }
                    domainId = newDomainId;
                    return cb(null);
                });
            }
            else{
                const error = Boom.badRequest(`The agent with the id ${domain.agent} doesn't exist`);
                return cb(error, null);
            }
        },
        (cb) => {

            redis.zadd(`agentDomains:${domain.agent}`, 'NX', domainId, domain.domainName, (err, addResponse) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the name to the domains list.');
                    return cb(error);
                }
                return cb(null, addResponse);
            });
        },
        (addResponse, cb) => {

            if (addResponse !== 0){
                domain = Object.assign({id: domainId}, domain);          
                const flatDomain = Flat(domain);  
                redis.hmset(`domain:${domainId}`, flatDomain, (err) => {
                    
                    if (err){
                        const error = Boom.badImplementation('An error ocurred adding the domain data.');
                        return cb(error);
                    }
                    return cb(null, domain);
                });
            }
            else{
                const error = Boom.badRequest(`A domain with this name already exists in the agent ${domain.agent}.`);
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