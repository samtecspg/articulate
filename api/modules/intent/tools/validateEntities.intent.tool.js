'use strict';
const _ = require('lodash');
const Boom = require('boom');
const Async = require('async');

const validateEntities = (redis, agent, examples, cb) => {

    const usedEntities = _.uniq(_.compact(_.flatten(_.map(examples, (example) => {
        
        const entities = example.match(/\{(.+?)\}/g);
        return entities;
    }))));

    Async.forEach(usedEntities, (entity, callback) => {

        redis.exists(`agentEntities:${agent}`, (err, entityExist) => {
            
            if (err){
                const error = Boom.badImplementation('An error ocurred checking if the entity exists.');
                return callback(error);
            }
            if (entityExist){
                return callback(null);
            }
            else {
                const error = Boom.badImplementation(`The entity with the name ${entity} doesn't exist in the agent ${agent}`);
                return callback(error);
            }
        });        
    }, (err) => {

        if (err){
            return cb(err);
        }
        return cb(null);
    });
};

module.exports = validateEntities;
