'use strict';

const noflo = require('noflo');
const POST_REQUEST = 'request';
const POST_OUT = 'out';
exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = 'Parses the data out of a request object';
    c.icon = 'forward';

    c.inPorts.add(POST_REQUEST, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.outPorts.add(POST_OUT, {
        datatype: 'object'
    });

    return c.process((input, output) => {
        if (!input.has(POST_REQUEST)) {
            return;
        }
        const request = input.getData(POST_REQUEST);
        const { params, query, payload } = request;
        const data = { ...params, ...query, ...payload };
        output.sendDone({ [POST_OUT]: data });
    });
};
