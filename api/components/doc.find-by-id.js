'use strict';

const noflo = require('noflo');
const Flat = require('../helpers/flat');
const Cast = require('../helpers/cast');

const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = 'Get document by id';
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
        redis.hgetall(`document:${id}`, (err, document) => {
            if (err) {
                err.key = id;
                return output.sendDone({ [PORT_ERROR]: err });
            }
            if (!document) {
                err = new Error('The specified document doesn\'t exists');
                err.key = id;
                return output.sendDone({ [PORT_ERROR]: err });
            }
            return output.sendDone({ [PORT_OUT]: Cast(Flat.unflatten(document), 'document') });
        });
    });
};
