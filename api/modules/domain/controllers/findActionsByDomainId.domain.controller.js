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
    const domainId = request.params.id;

    Async.waterfall([
        (cb) => {

            server.inject(`/domain/${domainId}`, (res) => {

                if (res.statusCode !== 200){
                    if (res.statusCode === 404){
                        const error = Boom.notFound('The specified domain doesn\'t exists');
                        return cb(error, null);
                    }
                    const error = Boom.create(res.statusCode, 'An error occurred getting the domain');
                    return cb(error, null);
                }
                return cb(null);
            });
        },
        (cb) => {

            redis.zrange(`domainActions:${domainId}`, 0, -1, 'withscores', (err, actions) => {

                if (err){
                    const error = Boom.badImplementation('An error occurred getting the actions of the domain from the sorted set.');
                    return cb(error);
                }
                actions = _.chunk(actions, 2);
                total = actions.length;
                if (filter && filter !== ''){
                    actions = _.filter(actions, (action) => {

                        return action[0].toLowerCase().indexOf(filter.toLowerCase()) !== -1;
                    });
                    total = actions.length;
                }
                actions = _.sortBy(_.map(actions, (action) => {

                    return { actionName: action[0], id: action[1] };
                }), 'actionName');
                if (limit !== -1){
                    actions = actions.slice(start, limit);
                }
                return cb(null, actions);
            });
        },
        (actions, cb) => {

            Async.map(actions, (action, callback) => {

                server.inject('/action/' + action.id, (res) => {

                    if (res.statusCode !== 200){
                        const error = Boom.create(res.statusCode, `An error occurred getting the data of the action ${action.id}`);
                        return callback(error, null);
                    }
                    return callback(null, res.result);
                });
            }, (err, result) => {

                if (err){
                    return cb(err, null);
                }
                return cb(null, { actions: result, total });
            });
        }
    ], (err, result) => {

        if (err) {
            return reply(err, null);
        }
        return reply(result);
    });
};
