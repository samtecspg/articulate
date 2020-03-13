import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            signingSecret: Joi.string().required(),
            botAccessToken: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number(),
            useAgentWelcomeAction: Joi.boolean()
        }

        return Joi.validate(details, schema)
    }
};
