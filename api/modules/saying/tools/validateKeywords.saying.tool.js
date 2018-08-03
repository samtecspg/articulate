'use strict';
const _ = require('lodash');
const Boom = require('boom');
const Async = require('async');

const validateKeywords = (redis, agent, keywords, cb) => {

    const usedKeywords = _.map(keywords, 'keyword'); ;

    Async.forEach(usedKeywords, (keyword, callback) => {

        if (keyword.startsWith('sys.')){
            return callback(null);
        }
        redis.zscore(`agentKeywords:${agent}`, keyword, (err, keywordExist) => {

            if (err){
                const error = Boom.badImplementation('An error occurred checking if the keyword exists.');
                return callback(error);
            }
            if (keywordExist){
                return callback(null);
            }
            const error = Boom.badRequest(`The keyword with the name ${keyword} doesn't exist in the agent ${agent}`);
            return callback(error);
        });
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = validateKeywords;
