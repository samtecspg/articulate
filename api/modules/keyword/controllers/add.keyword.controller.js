'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    let keywordId = null;
    let keyword = request.payload;
    const redis = request.server.app.redis;

    if (keyword.keywordName.startsWith('sys.')){
        const error = Boom.badRequest('\'sys.\' is a reserved prefix for system keywords. Please use another keyword name');
        return reply(error, null);
    }
    Async.waterfall([
        (cb) => {

            redis.zscore('agents', keyword.agent, (err, agentId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred checking if the agent exists.');
                    return cb(error);
                }
                if (agentId){
                    return cb(null, agentId);
                }
                const error = Boom.badRequest(`The agent ${keyword.agent} doesn't exist`);
                return cb(error, null);
            });
        },
        (agentId, cb) => {

            redis.incr('keywordId', (err, newKeywordId) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the new keyword id.');
                    return cb(error);
                }
                keywordId = newKeywordId;
                return cb(null, agentId);
            });
        },
        (agentId, cb) => {

            redis.zadd(`agentKeywords:${agentId}`, 'NX', keywordId, keyword.keywordName, (err, addResponse) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the name to the keywords list.');
                    return cb(error);
                }
                if (addResponse !== 0){
                    return cb(null);
                }
                const error = Boom.badRequest(`A keyword with this name already exists in the agent ${keyword.agent}.`);
                return cb(error);
            });
        },
        (cb) => {

            keyword = Object.assign({ id: keywordId }, keyword);
            const flatKeyword = RemoveBlankArray(Flat(keyword));
            if (!keyword.regex){
                keyword.regex = null;
                flatKeyword.regex = '';
            }
            redis.hmset(`keyword:${keywordId}`, flatKeyword, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the keyword data.');
                    return cb(error);
                }
                return cb(null, keyword);
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result);
    });
};
