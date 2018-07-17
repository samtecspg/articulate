'use strict';

const NoFlo = require('noflo');
const PORT_IN = 'in';
const PORT_AGENT_ID = 'agent_id';
const PORT_DOMAIN_ID_AGENT_ID = 'domain_id_agent_id';
const PORT_ALL = 'all';
exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Parses the data out of a request object';
    c.icon = 'forward';

    c.inPorts.add(PORT_IN, {
        datatype: 'object',
        description: 'Object with all parsed values.'
    });

    c.outPorts.add(PORT_AGENT_ID, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_DOMAIN_ID_AGENT_ID, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ALL, {
        datatype: 'object'
    });

    return c.process((input, output) => {

        const { scope } = input;
        if (!input.has(PORT_IN)) {
            return;
        }
        const data = input.getData(PORT_IN);
        const { id, domainId } = data;
        return output.sendDone({
            [PORT_AGENT_ID]: new NoFlo.IP('data', { id }, { scope }),
            [PORT_DOMAIN_ID_AGENT_ID]: new NoFlo.IP('data', { id, domainId }, { scope }),
            [PORT_ALL]: new NoFlo.IP('data', data, { scope })
        });
    });
};
