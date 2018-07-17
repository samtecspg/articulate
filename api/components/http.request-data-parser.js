'use strict';

const NoFlo = require('noflo');
const PORT_REQUEST = 'request';
const PORT_OUT = 'out';
exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Parses the data out of a request object';
    c.icon = 'forward';

    c.inPorts.add(PORT_REQUEST, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.outPorts.add(PORT_OUT, {
        datatype: 'object'
    });

    return c.process((input, output) => {

        const { scope } = input;
        if (!input.has(PORT_REQUEST)) {
            return;
        }
        const request = input.getData(PORT_REQUEST);
        const { params, query, payload } = request;
        const data = Object.assign({}, params, query, payload);
        return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', data, { scope }) });
    });
};
