'use strict';

const name = 'Console';
const NoFlo = require('noflo');
const _ = require('lodash');
const { inspect } = require('util');

const log = (options, data) => {

    if (options !== null) {
        const tag = _.pick(options, 'tag');
        const rest = _.omit(options, 'tag');
        console.log(`[${tag}]`);
        return console.log(inspect(
            data,
            rest.showHidden,
            rest.depth,
            rest.colors
        ));
    }
    return console.log(data);
};

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = `[${name}] Sends the data items to console.log`;
    c.icon = 'bug';

    c.inPorts.add('in', {
        datatype: 'all',
        description: 'Packet to be printed through console.log'
    });
    c.inPorts.add('options', {
        datatype: 'object',
        description: 'Options to be passed to console.log',
        control: true
    });
    c.outPorts.add('out', {
        datatype: 'all'
    });

    return c.process((input, output) => {

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

        const data = input.getData('in');
        log(options, data);
        output.sendDone({ out: data });
    });
};
