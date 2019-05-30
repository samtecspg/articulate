module.exports = {
    name: 'simple',
    scheme: 'basic',
    options: {
        validate: async (request, email, password, h) => {
            const { userService } = await request.services();
            const { isValid, user } = await userService.validate({ email, password, returnUser: true });

            if (!isValid) {
                return { credentials: null, isValid: false };
            }

            const credentials = { id: user.id, name: user.name, email: user.email };
            return { isValid, credentials };
        }
    }
};
