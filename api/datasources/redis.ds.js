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

const findAllInSet = ({ redis, type, subType = type, start = 0, limit = -1 }) => {

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

                    return err ? reject(err) : resolve(mapResults);
                });
        });
    });
};

const findAllByIdInList = ({ redis, type, subType = type, id, start = 0, limit = -1 }) => {

    start = start > -1 ? start : 0;
    limit = limit > -1 ? limit - 1 : -1;
    return new Promise((resolve, reject) => {

        redis.lrange(`${type}:${id}`, start, limit, (err, listOfIds) => {

            if (err) {
                return reject(err);
            }
            listOfIds = _.chunk(listOfIds, 2);

            Async.map(
                listOfIds,
                (item, cb) => {

                    findById({ redis, type: subType, id: item })
                        .then((result) => cb(null, result))
                        .catch(cb);
                },
                (err, mapResults) => {

                    return err ? reject(err) : resolve(mapResults);
                });
        });
    });
};

const exists = ({ redis, type, id }) => {

    return new Promise((resolve, reject) => {

        redis.exists(`${type}:${id}`, (err, exist) => {

            return err ? reject(err) : resolve(exist);
        });
    });
};

const deleteById = ({ redis, type, id }) => {

    const redisDel = (exist) => {

        return new Promise((resolve, reject) => {

            if (!exist) {
                return reject(errorHandlerNotFound({ type, id }));
            }
            redis.del(`${type}:${id}`, (err) => {

                return err ? reject(err) : resolve(true);
            });
        });
    };
    return exists({ redis, type, id }).then((exist) => redisDel(exist));

};

module.exports = {
    findById,
    findAllInSet,
    findAllByIdInList,
    exists,
    deleteById
};
