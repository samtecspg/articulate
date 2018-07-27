'use strict';

const Noflo = require('noflo');
const Async = require('async');
const _ = require('lodash');
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
const PORT_IN = 'in';

exports.getComponent = () => {
    const c = new Noflo.Component();
    c.description = 'Get all agents';
    c.icon = 'user';
    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });
    c.inPorts.add(PORT_REDIS, {
        datatype: 'object',
        description: 'Redis client'
    });

    c.outPorts.add(PORT_OUT, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    return c.process((input, output) => {
        if (!input.has(PORT_IN)) {
            return;
        }

        if (!input.has(PORT_REDIS)) {
            return;
        }
        const redis = input.getData(PORT_REDIS);
        let { start, limit } = input.getData(PORT_IN);
        start = start > -1 ? start : 0;
        limit = limit > -1 ? limit : -1;
        const getAgentById = ([name, id], cb) => {

            redis.hgetall(`agent:${id}`, (err, reply) => {
                if (err) {
                    err.key = id;
                    return cb(err);
                }
                if (!reply) {
                    err = new Error('Agent not found');
                    err.key = id;
                    return cb(err);
                }
                return cb(null, reply);
            });
        };

        redis.zrange('agents', start, limit === -1 ? limit : limit - 1, 'withscores', (err, agents) => {

            if (err) {
                return output.sendDone({ [PORT_ERROR]: err });
            }
            agents = _.chunk(agents, 2);
            //TODO: reuse agent.find-by-id component
            Async.map(agents, getAgentById, (err, results) => {

                if (err) {
                    return output.sendDone({ [PORT_ERROR]: err });
                }
                return output.sendDone({ [PORT_OUT]: results });
            });
        });

    });
};
