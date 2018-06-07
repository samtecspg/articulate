'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');
const Status = require('../../../helpers/status.json');

module.exports = (request, reply) => {

    let domainId = null;
    let domain = request.payload;
    const redis = request.server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.zscore('agents', domain.agent, (err, agentId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                    return cb(error);
                }
                if (agentId){
                    return cb(null, agentId);
                }
                const error = Boom.badRequest(`The agent ${domain.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (agentId, cb) => {

            redis.incr('domainId', (err, newDomainId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the new domain id.');
                    return cb(error);
                }
                domainId = newDomainId;
                return cb(null, agentId);
            });
        },
        (agentId, cb) => {

            redis.zadd(`agentDomains:${agentId}`, 'NX', domainId, domain.domainName, (err, addResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the name to the domains list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                const error = Boom.badRequest(`A domain with this name already exists in the agent ${domain.agent}.`);
                return cb(error, null);
            });
        },
        (cb) => {

            domain = Object.assign({ id: domainId }, domain);
            domain.status = Status.ready;
            const flatDomain = RemoveBlankArray(Flat(domain));
            redis.hmset(`domain:${domainId}`, flatDomain, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the domain data.');
                    return cb(error);
                }
                return cb(null, domain);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};
