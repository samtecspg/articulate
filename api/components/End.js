const noflo = require('noflo');

exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = '[END] This component drops every packet it receives with no action';
    c.icon = 'trash-o';

    c.inPorts.add('in', {
        datatypes: 'all',
        description: 'Packet to be dropped',
    });

    c.outPorts.add('out', {
        datatype: 'all',
    });


    return c.process((input, output) => {
        console.log(`End::Process`); // TODO: REMOVE!!!!
        const data = `${input.getData('in')}[END]`;
        console.log(data); // TODO: REMOVE!!!!
        output.sendDone({ out: data });
    });
};