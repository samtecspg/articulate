import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            pageAccessToken: Joi.string().required(),
            appSecret: Joi.string()
        }

        return Joi.validate(details, schema)
    }
};
