const noflo = require('noflo');

exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = `[START] Forwards packets and metadata in the same way it receives them`;
    c.icon = 'forward';
    c.inPorts.add('in', {
        datatype: 'all',
        description: 'Packet to forward',
    });
    c.outPorts.add('out1', {
        datatype: 'all',
    });
    c.outPorts.add('out2', {
        datatype: 'all',
    });

    return c.process((input, output) => {
        console.log(`Start::Process`); // TODO: REMOVE!!!!
        const data = `${input.getData('in')}[START]`;
        console.log(data); // TODO: REMOVE!!!!
        if (data.indexOf('1') === 0) {
            output.sendDone({ out1: data });
        } else {
            output.sendDone({ out2: data });
        }

    });
};