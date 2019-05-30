module.exports = {
    name: 'session',
    scheme: 'cookie',
    options: {
        password: process.env.SESSION_SECRET,
        isSecure: false,
        clearInvalid: true,
        validateFunc: async (request, session) => {
            return { valid: true, credentials: request.auth.credentials };
        },
    },
};
