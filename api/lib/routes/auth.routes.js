import Boom from 'boom';

const handler = async (request, h) => {
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

const authRoutes = ['twitter', 'github'].map((provider) => ({
    method: ['GET'],
    path: `/auth/${provider}`,
    config: {
        auth: {
            mode: 'try',
            strategy: provider
        },
        handler
    }
}));
module.exports = [
    ...authRoutes,
    {
        method: 'GET',
        path: '/session',
        config: {
            auth: 'session',
            handler: (request, h) => {
                return `Hello, ${request.auth.credentials.name}!`;
            }
        }
    }, {
        method: 'POST',
        path: '/auth/basic',
        config: {
            auth: {
                mode: 'try',
                strategy: 'simple',
            },
            handler: async (request, h) => {
                const { credentials } = request.auth;
                if (credentials) {
                    await request.cookieAuth.set(credentials);
                    return { isValid: true };
                }
                return { isValid: false };
            },
        },
    }
];
