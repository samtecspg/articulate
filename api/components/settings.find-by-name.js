'use strict';

const NoFlo = require('noflo');
const Flat = require('../helpers/flat');
const Boom = require('boom');

const PORT_IN = 'in';
const PORT_REDIS = 'redis';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';
exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get settings by name';
    c.icon = 'gear';

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
        const { scope } = input;
        const [{ name }, redis] = input.getData(PORT_IN, PORT_REDIS);
        // TODO: move to redis.ds, keeping ot here bcs it has a different Cast/Flat than others

        redis.hgetall(`settings:${name}`, (err, setting) => {

            if (err) {
                err.key = name;
                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.internal(err), { scope }) });
            }
            if (!setting) {
                err = new Error('This setting doesn\'t exists');
                err.key = name;
                return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.internal(err), { scope }) });
            }
            let unflattenData = Flat.unflatten(setting);
            unflattenData = unflattenData.string_value_setting ? unflattenData.string_value_setting : unflattenData;
            return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', unflattenData, { scope }) });
        });
    });
};
