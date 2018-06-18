'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    let start = 0;
    if (request.query && request.query.start > -1){
        start = request.query.start;
    }
    let limit = -1;
    if (request.query && request.query.limit > -1){
        limit = request.query.limit;
    }
    let filter = '';
    if (request.query.filter && request.query.filter.trim() !== ''){
        filter = request.query.filter;
    }
    let total = 0;
    const agentId = request.params.id;

    Async.waterfall([
        (cb) => {

            redis.zrange(`agentEntities:${agentId}`, 0, -1, 'withscores', (err, entities) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the entities of the agent from the sorted set.');
                    return cb(error);
                }
                entities = _.chunk(entities, 2);
                total = entities.length;
                if (filter && filter !== ''){
                    entities = _.filter(entities, (entity) => {

                        return entity[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = entities.length;
                }
                entities = _.sortBy(_.map(entities, (entity) => {

                    return { entityName: entity[0], id: entity[1] };
                }), 'entityName');
                if (limit !== -1){
                    entities = entities.slice(start, limit);
                }
                return cb(null, entities);
            });
        },
        (entities, cb) => {

            Async.map(entities, (entity, callback) => {

                server.inject('/entity/' + entity.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the entity ${entity.id} with id ${entity.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { entities: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
