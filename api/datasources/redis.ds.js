'use strict';
const _ = require('lodash');
const Flat = require('../helpers/flat');
const Cast = require('../helpers/cast');
const Async = require('async');

const errorHandlerNotFound = ({ type }) => {

    return new Error(`[${_.startCase(type)}] not found.`);
};

const findById = ({ redis, type, id }) => {

    return new Promise((resolve, reject) => {

        redis.hgetall(`${type}:${id}`, (err, result) => {

            if (err) {
                return reject(err);
            }
            if (!result) {
                return reject(errorHandlerNotFound({ type, id }));
            }
            return resolve(Cast(Flat.unflatten(result), type));
        });
    });
};

const findAll = ({ redis, type, subType = type, start = 0, limit = -1 }) => {

    start = start > -1 ? start : 0;
    limit = limit > -1 ? limit - 1 : -1;
    return new Promise((resolve, reject) => {

        redis.zrange(type, start, limit, 'withscores', (err, results) => {

            if (err) {
                return reject(err);
            }
            results = _.chunk(results, 2);

            Async.map(
                results,
                (item, cb) => {

                    findById({ redis, type: subType, id: item[1] })
                        .then((result) => cb(null, result))
                        .catch(cb);
                },
                (err, mapResults) => {

                    if (err) {
                        return reject(err);
                    }
                    return resolve(mapResults);
                });
        });
    });
};

module.exports = {
    findById,
    findAll
};
