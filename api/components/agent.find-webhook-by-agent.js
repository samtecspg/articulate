'use strict';

const NoFlo = require('noflo');
const RedisDS = require('../datasources/redis.ds');
const Boom = require('boom');
const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get Webhook by Agent';
    c.icon = 'user';
    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Agent object.'
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

        if (!input.has(PORT_IN, PORT_REDIS)) {
            return;
        }
        const { scope } = input;
        const [{ id, agentName }, redis] = input.getData(PORT_IN, PORT_REDIS);
        RedisDS
            .findById({
                redis,
                type: 'agentWebhook',
                id
            })
            .then((webhook) => {

                webhook.agent = agentName;
                return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', webhook, { scope }) });
            })
            .catch((err) => {

                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.internal(err.message), { scope }) });
            });

    });
};
