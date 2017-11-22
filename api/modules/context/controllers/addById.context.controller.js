'use strict';
const Async = require('async');
const Boom = require('boom');
const Flat = require('flat');
    
module.exports = (request, reply) => {

    let contextId = null;
    const sessionId = request.params.sessionId;
    let context = request.payload;
    const redis = request.server.app.redis;

    Async.series({
        contextId: (cb) => {

            redis.incr('contextId', (err, newContextId) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new context id.');
                    return cb(error);
                }
                contextId = newContextId;
                return cb(null);
            });
        },
        sessionContexts: (cb) => {

            redis.rpush(`sessionContexts:${sessionId}`, contextId, (err) => {

                if (err){
                    const error = Boom.badImplementation('An error ocurred getting the new context id.');
                    return cb(error);
                }
                return cb(null);
            });
        },
        context: (cb) => {

            context = Object.assign({id: contextId}, context);          
            const flatContext = Flat(context);  
            redis.hmset(`context:${contextId}`, flatContext, (err) => {
                
                if (err){
                    const error = Boom.badImplementation('An error ocurred adding the context data.');
                    return cb(error);
                }
                return cb(null, context);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err, null);
        }
        return reply(result.context);
    });
};