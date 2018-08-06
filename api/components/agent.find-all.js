'use strict';

const Noflo = require('noflo');
const RedisDS = require('../datasources/redis.ds');

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
        const { start, limit } = input.getData(PORT_IN);
        RedisDS
            .findAll({
                redis,
                start,
                limit,
                type: 'agents',
                subType: 'agent'
            })
            .then((agents) => {

                return output.sendDone({ [PORT_OUT]: agents });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: err });
            });
    });
};