'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('../../../helpers/flat');
const Cast = require('../../../helpers/cast');
const RemoveBlankArray = require('../../../helpers/removeBlankArray');

module.exports = (request, reply) => {

    const contextId = request.params.id;
    const sessionId = request.params.sessionId;
    const updateData = request.payload;

    const server = request.server;
    const redis = server.app.redis;

    Async.waterfall([
        (cb) => {

            redis.lrange(`sessionContexts:${sessionId}`, 0, -1, (err, contextElements) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred retrieving the context of this session');
                    return cb(error, null);
                }
                if (contextElements.length > 0){
                    if (contextElements.indexOf(contextId) > -1){
                        return cb(null);
                    }
                    const error = Boom.notFound('This context element doesn\'t exists in this session');
                    return cb(error, null);
                }
                const error = Boom.notFound('This session doesn\'t have a context');
                return cb(error, null);
            });
        },
        (cb) => {

            redis.hgetall(`context:${contextId}`, (err, data) => {

                if (err){
                    const error = Boom.badImplementation(`An error occurred retrieving the context ${contextId}.`);
                    return cb(error);
                }
                if (data){
                    return cb(null, Flat.unflatten(data));
                }
                const error = Boom.notFound(`The context ${contextId} doesn\'t exists`);
                return cb(error);
            });
        },
        (currentContext, cb) => {

            redis.del(`context:${contextId}`, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred temporaly removing the context for the update.');
                    return cb(error);
                }
                return cb(null, currentContext);
            });
        },
        (currentContext, cb) => {

            currentContext.slots = updateData.slots;
            const flatContextElement = Flat(currentContext);
            const flatUpdateData = Flat(updateData);
            Object.keys(flatUpdateData).forEach( (key) => {

                flatContextElement[key] = flatUpdateData[key];
            });
            redis.hmset(`context:${contextId}`, RemoveBlankArray(flatContextElement), (err) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred adding the context data.');
                    return cb(error);
                }
                return cb(null, Flat.unflatten(flatContextElement));
            });
        }
    ], (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(Cast(result, 'context'));
    });
};
