'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
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
    let total = 0;
    const agentId = request.params.id;

    Async.waterfall([
        (cb) => {

            redis.zrange(`agentDomains:${agentId}`, 0, -1, 'withscores', (err, domains) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the domains of the agent from the sorted set.');
                    return cb(error);
                }
                domains = _.chunk(domains, 2);
                total = domains.length;
                if (filter && filter !== ''){
                    domains = _.filter(domains, (domain) => {

                        return domain[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = domains.length;
                }
                domains = _.sortBy(_.map(domains, (domain) => {

                    return { domainName: domain[0], id: domain[1] };
                }), 'domainName');
                if (limit !== -1){
                    domains = domains.slice(start, limit);
                }
                return cb(null, domains);
            });
        },
        (domains, cb) => {

            Async.map(domains, (domain, callback) => {

                server.inject('/domain/' + domain.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domain.id} with id ${domain.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { domains: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
