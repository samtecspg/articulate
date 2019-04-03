import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {}

        return Joi.validate(details, schema)
    }
};
