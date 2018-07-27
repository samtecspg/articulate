'use strict';

const noflo = require('noflo');

const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = 'Get agent by id';
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
        const [{ id }, redis] = input.getData(PORT_IN, PORT_REDIS);
        redis.hgetall(`agent:${id}`, (err, reply) => {
            if (err) {
                err.key = id;
                return output.sendDone({ [PORT_ERROR]: err });
            }
            if (!reply) {
                err = new Error('Agent not found');
                err.key = id;
                return output.sendDone({ [PORT_ERROR]: err });
            }
            return output.sendDone({ [PORT_OUT]: reply });
        });
    });
};
