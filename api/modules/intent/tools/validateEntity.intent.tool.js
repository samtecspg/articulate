'use strict';
const Helpers = require('../../../helpers');
const Async = require('async');

const validateEntity = (elasticsearchClient, agent, entity, callback) => {

    Async.parallel([
        (cb) => {

            Helpers.exists(elasticsearchClient, 'entity', entity, cb);
        },
        (cb) => {

            const fields = {
                agent,
                _id: entity
            };
            Helpers.belongs(elasticsearchClient, 'entity', fields, cb);
        }
    ], (err) => {

        if (err){
            return callback(err);
        }
        return callback(null);
    });
};

module.exports = validateEntity;
