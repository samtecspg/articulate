'use strict';

const NoFlo = require('noflo');
const PORT_REDIS = 'redis';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Redis Client';
    c.icon = 'database';
    c.inPorts.add(PORT_REDIS, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.outPorts.add(PORT_REDIS, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    return c.process((input, output) => {

        const { scope } = input;
        if (!input.has(PORT_REDIS)) {
            return;
        }

        return output.sendDone({ [PORT_REDIS]: new NoFlo.IP('data', input.getData(PORT_REDIS), { scope }) });
    });
};
