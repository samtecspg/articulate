'use strict';

const NoFlo = require('noflo');
const Boom = require('boom');
const PORT_AGENT = 'agent_object';
const PORT_ACTION = 'action_object';
const PORT_DOMAIN = 'domain_object';
const PORT_OUT = 'out';
const PORT_ERROR = 'error';

exports.getComponent = () => {

    const c = new NoFlo.Component();
    c.description = 'Get Webhook by Action id';
    c.icon = 'user';

    c.inPorts.add(PORT_AGENT, {
        datatype: 'object'
    });

    c.inPorts.add(PORT_ACTION, {
        datatype: 'object'
    });

    c.inPorts.add(PORT_DOMAIN, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_OUT, {
        datatype: 'object'
    });

    c.outPorts.add(PORT_ERROR, {
        datatype: 'object'
    });

    return c.process((input, output) => {

        if (!input.has(PORT_AGENT, PORT_DOMAIN, PORT_ACTION)) {
            return;
        }

        const { scope } = input;
        const [agent, domain, action] = input.getData(PORT_AGENT, PORT_DOMAIN, PORT_ACTION);
        const errors = [];
        if (!agent) {
            errors.push(`Agent [${agent.id}] doesn't exists`);
        }
        if (!domain) {
            errors.push(`Domain [${domain.id}] doesn't exists`);
        }
        if (!action) {
            errors.push(`Action [${action.id}] doesn't exists`);
        }
        if (errors.length > 0) {
            return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.badRequest(errors.join('\n')), { scope }) });
        }
        if (
            (action.agent === agent.agentName) &&
            (action.domain === domain.domainName)) {
            return output.sendDone({ [PORT_OUT]: new NoFlo.IP('data', action, { scope }) });
        }
        return output.sendDone({ [PORT_ERROR]: new NoFlo.IP('data', Boom.badRequest('The specified action is not linked with this domain or agent'), { scope }) });
    });
};
