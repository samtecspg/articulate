const name='CONSOLE2';
const noflo = require('noflo');
const { inspect } = require('util');

const log = (options, data) => {
    if (options != null) {
        return console.log(inspect(
            data,
            options.showHidden,
            options.depth,
            options.colors,
        ));
    }
    return console.log(data);
};



exports.getComponent = () => {
    const c = new noflo.Component();
    c.description = `[${name}] Sends the data items to console.log`;
    c.icon = 'bug';

    c.inPorts.add('in', {
        datatype: 'all',
        description: 'Packet to be printed through console.log',
    });
    c.inPorts.add('options', {
        datatype: 'object',
        description: 'Options to be passed to console.log',
        control: true,
    });
    c.outPorts.add('out', {
        datatype: 'all',
    });

    return c.process((input, output) => {
        console.log(`[${name}]::Process`); // TODO: REMOVE!!!!
        if (!input.hasData('in')) {
            return;
        }
        if (input.attached('options').length && !input.hasData('options')) {
            return;
        }

        let options = null;
        if (input.has('options')) {
            options = input.getData('options');
        }

        const data = `${input.getData('in')}[${name}]`;
        log(options, data);
        output.sendDone({ out: data });
    });
};