import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            rocketchatURL: Joi.string().required(),
            rocketchatUser: Joi.string().required(),
            rocketchatPassword: Joi.string().required(),
            outgoingMessages: Joi.boolean(),
            waitTimeBetweenMessages: Joi.number()
        };

        return Joi.validate(details, schema)
    }
};
