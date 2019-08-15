import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            signingSecret: Joi.string().required(),
            botAccessToken: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number()
        }

        return Joi.validate(details, schema)
    }
};
