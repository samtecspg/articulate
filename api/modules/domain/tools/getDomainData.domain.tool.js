'use strict';
const Async = require('async');
const Boom = require('boom');

const getDomainData = (server, domainId, cb) => {

    Async.parallel({
        entities: (callback) => {

            server.inject(`/domain/${domainId}/entity`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the entities of the domain ${domainId}`);
                    return callback(error, null);
                }
                return callback(null, res.result);
            });
        },
        intents: (callback) => {

            server.inject(`/domain/${domainId}/intent`, (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, `An error occurred getting the intents of the domain ${domainId}`);
                    return callback(error, null);
                }
                return callback(null, res.result.intents);
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
