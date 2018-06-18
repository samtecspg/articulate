'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');
const Cast = require('../../../helpers/cast');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    let start = 0;
    if (request.query && request.query.start > -1) {
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1) {
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

                if (err) {
                    const error = Boom.badImplementation('An error occurred getting the domains from the sorted set.');
                    return cb(error);
                }
                domains = _.chunk(domains, 2);
                return cb(null, domains);
            });
        },
        (domains, cb) => {

            Async.map(domains, (domain, callback) => {

                const url = `/domain/${domain[1]}/intent${filter !== '' ? `?filter=${filter}` : ''}`;
                server.inject(url, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the domain ${domain[0]} with id ${domain[1]}`);
                        return callback(error, null);
                    }
                    total += res.result.total;
                    return callback(null, res.result.intents);
                });

            }, (err, result) => {

                if (err) {
                    return cb(err, null);
                }
                return cb(null, result);
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        result = _.flatten(result).map((intent) => {

            return Cast(intent, 'intent');
        });
        result = _.sortBy(result, 'intentName');
        if (limit !== -1){
            result = result.slice(start, limit);
        }
        return reply({ intents: result, total });
    });
};
