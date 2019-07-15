module.exports = {
    name: 'session',
    scheme: 'cookie',
    options: {
        password: process.env.SESSION_SECRET,
        isSecure: false,
        isHttpOnly: false,
        clearInvalid: true,
    },
};
