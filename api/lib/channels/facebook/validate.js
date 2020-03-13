import Joi from 'joi';

module.exports = {
    create: (details) => {
        const schema = {
            pageAccessToken: Joi.string().required(),
            appSecret: Joi.string(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number(),
            useAgentWelcomeAction: Joi.boolean(),
            messageBeforeButtonResponse: Joi.string.required(),
        }

        return Joi.validate(details, schema)
    }
};
