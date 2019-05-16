import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            rocketchatURL: Joi.string().required(),
            rocketchatUser: Joi.string().required(),
            rocketchatPassword: Joi.string().required()
        };

        return Joi.validate(details, schema)
    }
};
