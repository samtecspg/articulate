'use strict';
const _ = require('lodash');
const Flat = require('../helpers/flat');
const Cast = require('../helpers/cast');
const Async = require('async');

const errorHandlerNotFound = ({ type }) => {

    return new Error(`${_.startCase(type)} not found.`);
};

const findById = ({ redis, type, id, unflatten = true, cast = true }) => {

    return new Promise((resolve, reject) => {

        redis.hgetall(`${type}:${id}`, (err, result) => {

            if (err) {
                return reject(err);
            }
            if (!result) {
                return reject(errorHandlerNotFound({ type, id }));
            }
            result = unflatten ? Flat.unflatten(result) : result;
            result = cast ? Cast(result, type) : result;
            return resolve(result);
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

// Settings are stored differently than most other models
const findAllSettings = ({ redis, type, id, unflatten, cast }) => {

    return new Promise((resolve, reject) => {

        redis.smembers(`${type}${id ? `:${id}` : ''}`, (err, results) => {

            if (err) {
                return reject(err);
            }
            const finalResults = {};
            Async.each(
                results,
                (settings, cb) => {

                    findById({ redis, type, id: `${id ? `${id}:` : ''}${settings}`, unflatten, cast })
                        .then((result) => {

                            result = result.string_value_setting ? result.string_value_setting : result;
                            finalResults[settings] = result;
                            return cb();
                        })
                        .catch(cb);
                },
                (err) => {

                    return err ? reject(err) : resolve(finalResults);
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
    findAllSettings,
    findAllByIdInList,
    exists,
    deleteById
};
