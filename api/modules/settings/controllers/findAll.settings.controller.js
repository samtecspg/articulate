'use strict';
const Async = require('async');
const Boom = require('boom');

module.exports = (request, reply) => {

    const server = request.server;

    Async.parallel({
        uiLanguage: (cb) => {

            server.inject('/settings/uiLanguage', (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the ui language setting');
                    return cb(error, null);
                }
                return cb(null, res.result.uiLanguage);
            });
        },
        domainClassifierPipeline: (cb) => {

            server.inject('/settings/domainClassifierPipeline', (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the domain classifier pipeline');
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        intentClassifierPipeline: (cb) => {

            server.inject('/settings/intentClassifierPipeline', (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the intent classifer pipeline');
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        },
        entityClassifierPipeline: (cb) => {

            server.inject('/settings/entityClassifierPipeline', (res) => {

                if (res.statusCode !== 200){
                    const error = Boom.create(res.statusCode, 'An error occurred getting the data of the entity classifer pipeline');
                    return cb(error, null);
                }
                return cb(null, res.result);
            });
        }
    }, (err, result) => {

        if (err){
            return reply(err);
        }
        return reply(result);
    });
};
