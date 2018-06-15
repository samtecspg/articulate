'use strict';
const _ = require('lodash');
const Boom = require('boom');
const Async = require('async');

const extractEntities = (examples) => {

    //Only system entities have an extractor specified, so ignore sys entities
    const entities = _.compact(_.uniq(_.flatten(_.map(_.filter(_.flatten(_.map(examples, 'entities')), (entity) => {

        return !entity.extractor;
    }), 'entity'))));
    return entities;
};

const validateEntities = (redis, agent, examples, cb) => {

    const usedEntities = extractEntities(examples);

    Async.forEach(usedEntities, (entity, callback) => {

        if (entity.startsWith('sys.')){
            return callback(null);
        }
        redis.zscore(`agentEntities:${agent}`, entity, (err, entityExist) => {

            if (err){
                const error = Boom.badImplementation('An error occurred checking if the entity exists.');
                return callback(error);
            }
            if (entityExist){
                return callback(null);
            }
            const error = Boom.badRequest(`The entity with the name ${entity} doesn't exist in the agent ${agent}`);
            return callback(error);
        });
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = validateEntities;
