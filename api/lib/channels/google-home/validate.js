import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            actionsIntentMain: Joi.string().required(),
            actionsIntentClose: Joi.string().required()
        };
        return Joi.validate(details, schema)
    }
};
