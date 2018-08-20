'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const PORT_ACTION = 'action_object';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get Webhook by Action id';
    c.icon = 'user';
    c.inPorts.add(PORT_ACTION, {
        datatype: 'object'
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
                type: 'actionWebhook',
                id
            })
            .then((actionWebhook) => {

                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', actionWebhook, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', err, { scope }) });
            });

    });
};
