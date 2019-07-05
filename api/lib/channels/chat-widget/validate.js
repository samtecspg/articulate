import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            title: Joi.string().required(),
            subtitle: Joi.string().required(),
            senderPlaceHolder: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number()
        };

        return Joi.validate(details, schema)
    }
};