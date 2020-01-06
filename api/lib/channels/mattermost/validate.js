import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            userName: Joi.string().required(),
            userSelectionsPrefix: Joi.string(),
            incomingWebhookURL: Joi.string().required(),
            botAccessTokenOutgoingWebhook: Joi.string().required(),
            botAccessTokenSlashCommand: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number(),
            useAgentWelcomeAction: Joi.boolean()
        }

        return Joi.validate(details, schema)
    }
};
