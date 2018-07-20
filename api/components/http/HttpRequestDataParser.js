'use strict';

const noflo = require('noflo');
exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = 'Parses the data out of a request object';
    c.icon = 'forward';
    c.inPorts.add('in', {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.outPorts.add('out', {
        datatype: 'object'
    });

    return c.process((input, output) => {
        if (!input.has('in')) {
            return;
        }
        const request = input.getData('in');
        const { params, payload, query } = request;
        const data = { ...params, ...query, ...payload };
        output.sendDone({ out: data });
    });
};
