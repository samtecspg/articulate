'use strict';
const Async = require('async');
const Boom = require('boom');

const getDomainData = (server, domainId, cb) => {

    Async.parallel({
        keywords: (callback) => {

            server.inject(`/domain/${domainId}/keyword`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the keywords of the domain ${domainId}`);
                    return callback(error, null);
                }
                return callback(null, res.result);
            });
        },
        sayings: (callback) => {

            server.inject(`/domain/${domainId}/saying`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the sayings of the domain ${domainId}`);
                    return callback(error, null);
                }
                return callback(null, res.result.sayings);
            });
        }

    }, (err, result) => {

        if (err){
            return cb(err);
        }
        return cb(null, result);
    });

};

module.exports = getDomainData;
