import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            messageTitle: Joi.string().required(),
            message: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number()
        };

        return Joi.validate(details, schema)
    }
};
