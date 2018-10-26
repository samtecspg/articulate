import Code from 'code';
import Lab from 'lab';
import Package from '../package.json';
import * as Server from '../server';

// Test shortcuts
const { describe, it, before } = exports.lab = Lab.script();
const { expect } = Code;

describe('Deployment', () => {

    before(async ({ context }) => {

        context.server = await Server.deployment(true);
    });

    it('registers the main plugin.', ({ context }) => {

        const { server } = context;

        expect(server.registrations[Package.name]).to.exist();
    });
});

