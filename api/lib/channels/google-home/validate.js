import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            queryPatterns: Joi.array().items(Joi.string())
        };
        return Joi.validate(details, schema)
    }
};
