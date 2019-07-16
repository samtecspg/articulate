module.exports = {
    name: 'twitter',
    scheme: 'bell',
    options: {
        provider: 'twitter',
        password: process.env.SESSION_SECRET, // Use something more secure in production
        clientId: process.env.AUTH_TWITTER_KEY,
        clientSecret: process.env.AUTH_TWITTER_SECRET,
        isSecure: false, // Should be set to true (which is the default) in production,
        config: {
            getMethod: 'account/verify_credentials',
            getParams: {
                include_email: 'true',
                skip_status: 'true',
                include_entities: 'false'
            }
        },
        location: (request) => {
            const scheme = request.headers['x-scheme'];
            const host = request.info.host;
            const uri = request.headers['x-request-uri'];
            const url = new URL(`${scheme}://${host}${uri}`);
            return `${url.origin}${url.pathname}`;
        }
    }
};
