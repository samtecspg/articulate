'use strict';
const Async = require('async');
const Boom = require('boom');
const _ = require('lodash');

module.exports = (request, reply) => {

    const server = request.server;
    const redis = server.app.redis;
    const agentId = request.params.id;
    const entityId = request.params.entityId;

    Async.waterfall([
        (cb) => {

            server.inject('/agent/' + agentId, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const errorNotFound = Boom.notFound('The specified agent doesn\'t exists');
                        return reply(errorNotFound);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the agent');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`agentEntities:${agentId}`, 0, -1, 'withscores', (err, entities) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the entities from the sorted set.');
                    return cb(error);
                }
                entities = _.chunk(entities, 2);
                const entity = _.filter(entities, (tempEntity) => {

                    return tempEntity[1] === entityId.toString();
                })[0];
                return cb(null, entity);
            });
        },
        (entity, cb) => {

            if (entity){
                server.inject('/entity/' + entity[1], (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the entity ${entity[0]} with id ${entity[0]}`);
                        return cb(error, null);
                    }
                    return cb(null, res.result);
                });
            }
            else {
                const error = Boom.notFound('The specified entity doesn\'t exists in this agent');
                return cb(error);
            }
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
