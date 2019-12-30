import Boom from 'boom';
import {
    AUTH_ENABLED,
    AUTH_PROVIDERS
} from '../../util/env';

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

const LOGOUT_ROUTE = {
    method: 'GET',
    path: '/auth/logout',
    config: {
        auth: {
            mode: 'try',
            strategy: 'simple'
        },
        handler: async (request) => {

            await request.cookieAuth.clear();
            return { response: 'logged out' };
        }
    }
}

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
        const authRoutes = AUTH_PROVIDERS.map((provider) => ({
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
        return [...authRoutes, BASIC_ROUTE, LOGOUT_ROUTE];
    }
    return [];
};
