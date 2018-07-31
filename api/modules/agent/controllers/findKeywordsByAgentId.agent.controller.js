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

            redis.zrange(`agentKeywords:${agentId}`, 0, -1, 'withscores', (err, keywords) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the keywords of the agent from the sorted set.');
                    return cb(error);
                }
                keywords = _.chunk(keywords, 2);
                total = keywords.length;
                if (filter && filter !== ''){
                    keywords = _.filter(keywords, (keyword) => {

                        return keyword[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = keywords.length;
                }
                keywords = _.sortBy(_.map(keywords, (keyword) => {

                    return { keywordName: keyword[0], id: keyword[1] };
                }), 'keywordName');
                if (limit !== -1){
                    keywords = keywords.slice(start, limit);
                }
                return cb(null, keywords);
            });
        },
        (keywords, cb) => {

            Async.map(keywords, (keyword, callback) => {

                server.inject('/keyword/' + keyword.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the keyword ${keyword.id} with id ${keyword.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { keywords: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
