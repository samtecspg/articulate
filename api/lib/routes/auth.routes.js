import Boom from 'boom';

const BASIC_ROUTE = {
    method: 'POST',
    path: '/auth/basic',
    config: {
        auth: {
            mode: 'try',
            strategy: 'simple'
        },
        handler: async (request) => {
            const { credentials } = request.auth;
            if (credentials) {
                await request.cookieAuth.set(credentials);
                return { isValid: true };
            }
            return { isValid: false };
        }
    }
};

const AUTH_ENABLED = (() => {
    if (process.env.AUTH_ENABLED === undefined) {
        return true;
    }
    return process.env.AUTH_ENABLED === 'true';

})();

const PROVIDERS = process.env.AUTH_PROVIDERS ? process.env.AUTH_PROVIDERS.split(';') : [];

const HANDLER = async (request, h) => {
    try {
        const { userService } = await request.services();

        if (!request.auth.isAuthenticated) {
            return Boom.unauthorized(`Authentication failed: ${request.auth.error.message}`);
        }
        const { profile, token, secret, provider } = request.auth.credentials;
        const credential = await userService.authorizeOauth({
            profile,
            token,
            secret,
            provider
        });

        await request.cookieAuth.set(credential);
        return h.redirect('/');
    }
    catch (err) {
        console.error(err);
    }
};

module.exports = () => {

    if (AUTH_ENABLED) {
        const authRoutes = PROVIDERS.map((provider) => ({
            method: ['GET'],
            path: `/auth/${provider}`,
            config: {
                auth: {
                    mode: 'try',
                    strategy: provider
                },
                handler: HANDLER
            }
        }));
        return [...authRoutes, BASIC_ROUTE];
    }
    return [];
};
