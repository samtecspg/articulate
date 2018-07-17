'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const Boom = require('boom');
const PORT_ACTION = 'action_object';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get Post Format by Action id';
    c.icon = 'user';
    c.inPorts.add(PORT_ACTION, {
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

        if (!input.has(PORT_ACTION)) {
            return;
        }

        if (!input.has(PORT_REDIS)) {
            return;
        }
        const { scope } = input;
        const [action, redis] = input.getData(PORT_ACTION, PORT_REDIS);
        const { id } = action;
        RedisDS
            .findById({
                redis,
                type: 'actionPostFormat',
                id
            })
            .then((actionPostFormat) => {

                if (!actionPostFormat) {
                    return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.notFound(`Action Post Format [${id}] not found`), { scope }) });
                }

                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', actionPostFormat, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.internal(err.message), { scope }) });
            });
    });
};
