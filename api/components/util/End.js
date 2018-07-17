'use strict';
const NoFlo = require('noflo');

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = '[END] This component drops every packet it receives with no action';
    c.icon = 'trash-o';

    c.inPorts.add('in', {
        datatypes: 'all',
        description: 'Packet to be dropped'
    });

    c.outPorts.add('out', {
        datatype: 'all'
    });

    return c.process((input, output) => {

        const data = input.getData('in');
        output.sendDone({ out: data });
    });
};
