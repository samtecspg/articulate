'use strict';
const _ = require('lodash');
const Boom = require('boom');
const Async = require('async');

const validateEntities = (redis, agent, slots, cb) => {

    const usedEntities = _.map(slots, "entity");

    Async.forEach(usedEntities, (entity, callback) => {

        if (entity){
            redis.zscore(`agentEntities:${agent}`, entity, (err, entityExist) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred checking if the entity exists.');
                    return callback(error);
                }
                if (entityExist){
                    return callback(null);
                }
                else {
                    const error = Boom.badRequest(`The entity with the name ${entity} doesn't exist in the agent ${agent}`);
                    return callback(error);
                }
            });   
        }
        else {
            const error = Boom.badRequest(`Please check that every slots is pointing to a valid entity.`);
            return callback(error);
        }     
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = validateEntities;
