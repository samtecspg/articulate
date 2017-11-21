'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const redis = request.server.app.redis;
    const agentId = request.params.id;
    const domainId = request.params.domainId;
    let start = 0;
    if (request.query && request.query.start > -1){
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1){
        limit = request.query.limit;
    }

    Async.waterfall([
        (cb) => {
            
            request.server.inject('/agent/' + agentId, (res) => {
                
                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return reply(errorNotFound);       
                    }
                    const error = Boom.create(res.statusCode, 'An error ocurred getting the data of the agent');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`agentDomains:${agentId}`, 0, -1, 'withscores', (err, domains) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the domains from the sorted set.');
                    return cb(error);
                }
                domains =_.chunk(domains, 2);
                const domain = _.filter(domains, (domain) => {

                    return domain[1] == domainId;
                })[0];
                return cb(null, domain);
            });
        },
        (domain, cb) => {

            if (domain){
                request.server.inject(`/domain/${domain[1]}/intent?start=${start}&limit=${limit}`, (res) => {
                    
                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error ocurred getting the data of the domain ${domain[1]}`);
                        return cb(error, null);
                    }
                    return cb(null, res.result);
                });
            }
            else {
                const error = Boom.notFound('The specified domain doesn\'t exists in this agent');
                return cb(error);
            }
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
