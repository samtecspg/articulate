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

            if (filter && filter !== ''){
                redis.zrange(`agentDomains:${agentId}`, 0, -1, 'withscores', (err, domains) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred getting the domains of the agent from the sorted set.');
                        return cb(error);
                    }
                    domains = _.chunk(domains, 2);
                    domains = _.filter(domains, (domain) => {

                        return domain[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = domains.length;
                    domains = domains.slice(start, limit);
                    return cb(null, domains);
                });
            }
            else {
                redis.zrange(`agentDomains:${agentId}`, start, limit === -1 ? limit : limit - 1, 'withscores', (err, domains) => {

                    if (err){
                        const error = Boom.badImplementation('An error occurred getting the domains of the agent from the sorted set.');
                        return cb(error);
                    }
                    domains = _.chunk(domains, 2);
                    return cb(null, domains);
                });
            }
        },
        (domains, cb) => {

            Async.map(domains, (domain, callback) => {

                server.inject('/domain/' + domain[1], (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domain[0]} with id ${domain[1]}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, result);
            });
        },
        (domains, cb) => {

            if (filter && filter !== ''){
                return cb(null, { domains, total });
            }
            redis.zcount(`agentDomains:${agentId}`, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, (err, count) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the count of domains in the agent.');
                    return cb(error);
                }
                total = count;
                return cb(null, { domains, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
