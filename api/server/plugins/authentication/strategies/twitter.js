module.exports = {
    name: 'twitter',
    scheme: 'bell',
    profileParser: ['raw.name', '', 'raw.email'],

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
        }
    }
};
