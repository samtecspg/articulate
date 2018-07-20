'use strict';

const noflo = require('noflo');

exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = `[START] Forwards packets and metadata in the same way it receives them`;
    c.icon = 'forward';
    c.inPorts.add('in', {
        datatype: 'all',
        description: 'Packet to forward'
    });

    c.inPorts.add('port', {
        datatype: 'number',
        description: 'Port number to forward data',
        control: true
    });
    c.outPorts.add('out1', {
        datatype: 'all'
    });
    c.outPorts.add('out2', {
        datatype: 'all'
    });

    return c.process((input, output) => {
        if (!input.hasData('in')) {
            return;
        }
        const data = input.getData('in');
        const port = input.getData('port') || 1;
        output.sendDone({ [`out${port}`]: data });
    });
};