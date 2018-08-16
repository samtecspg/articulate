'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Verify if agent exists';
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

    c.outPorts.add(PORT_REDIS, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    c.forwardBrackets = {
        [PORT_IN]: [PORT_OUT]
    };

    return c.process((input, output) => {

        if (!input.has(PORT_IN, PORT_REDIS)) {
            return;
        }
        const { scope } = input;
        const [{ id }, redis] = input.getData(PORT_IN, PORT_REDIS);
        RedisDS
            .exists({
                redis,
                type: 'agent',
                id
            })
            .then((exists) => {

                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', exists, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope })  });
            });

    });
};
