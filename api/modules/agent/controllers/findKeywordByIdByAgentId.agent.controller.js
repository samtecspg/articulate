'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    const agentId = request.params.id;
    const keywordId = request.params.keywordId;

    Async.waterfall([
        (cb) => {

            server.inject('/agent/' + agentId, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return reply(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`agentKeywords:${agentId}`, 0, -1, 'withscores', (err, keywords) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the keywords from the sorted set.');
                    return cb(error);
                }
                keywords = _.chunk(keywords, 2);
                const keyword = _.filter(keywords, (tempKeyword) => {

                    return tempKeyword[1] === keywordId.toString();
                })[0];
                return cb(null, keyword);
            });
        },
        (keyword, cb) => {

            if (keyword){
                server.inject('/keyword/' + keyword[1], (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the keyword ${keyword[0]} with id ${keyword[0]}`);
                        return cb(error, null);
                    }
                    return cb(null, res.result);
                });
            }
            else {
                const error = Boom.notFound('The specified keyword doesn\'t exists in this agent');
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
