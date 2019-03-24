import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            appToken: Joi.string().required()
        }

        return Joi.validate(details, schema)
    }
};
