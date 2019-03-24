import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            signingSecret: Joi.string().required(),
            botAccessToken: Joi.string().required()
        }

        return Joi.validate(details, schema)
    }
};
