'use strict';
const Helpers = require('../../../helpers');
const Async = require('async');

const validateDomain = (elasticsearchClient, agent, domain, callback) => {

    Async.parallel([
        (cb) => {

            Helpers.exists(elasticsearchClient, 'domain', domain, cb);
        },
        (cb) => {

            const fields = {
                agent,
                _id: domain
            };
            Helpers.belongs(elasticsearchClient, 'domain', fields, cb);
        }
    ], (err) => {

        if (err){
            return callback(err);
        }
        return callback(null);
    });
};

module.exports = validateDomain;
