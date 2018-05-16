'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
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
    let filter = '';
    if (request.query.filter && request.query.filter.trim() !== ''){
        filter = request.query.filter;
    }

    Async.waterfall([
        (cb) => {

            server.inject('/agent/' + agentId, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return cb(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`agentDomains:${agentId}`, 0, -1, 'withscores', (err, domains) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the domains from the sorted set.');
                    return cb(error);
                }
                domains = _.chunk(domains, 2);
                const domain = _.filter(domains, (tempDomain) => {

                    return tempDomain[1] === domainId.toString();
                })[0];
                return cb(null, domain);
            });
        },
        (domain, cb) => {

            if (domain){
                server.inject(`/domain/${domain[1]}/intent?start=${start}&limit=${limit}${filter ? `&filter=${filter}` : ''}`, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domain[0]} with id ${domain[1]}`);
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
