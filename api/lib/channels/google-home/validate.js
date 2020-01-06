import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            queryPatterns: Joi.array().items(Joi.string()),
            useAgentWelcomeAction: Joi.boolean()
        };
        return Joi.validate(details, schema)
    }
};
