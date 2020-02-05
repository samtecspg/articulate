import Logger from '../../../../util/logger';

const log = Logger('plugin:auth:azure');
module.exports = {
    name: 'azuread',
    scheme: 'bell',
    profileParser: ['raw.given_name', 'raw.family_name', 'email'],
    options: {
        provider: 'azuread',
        password: process.env.SESSION_SECRET,
        clientId: process.env.AUTH_AZURE_KEY,
        clientSecret: process.env.AUTH_AZURE_SECRET,
        isSecure: false,
        config: { tenant: process.env.AUTH_AZURE_TENANT_ID }
    }
};

