import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            messageTitle: Joi.string().required(),
            message: Joi.string().required()
        };

        return Joi.validate(details, schema)
    }
};
