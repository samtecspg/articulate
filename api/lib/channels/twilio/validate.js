import Joi from 'joi';
const TwilioJoi = Joi.extend(require('joi-phone-number'));

module.exports = {
    create: ( details ) => {
        const schema = {
            authToken: TwilioJoi.string().required(),
            accountId: Joi.string().required(),
            whiteList: TwilioJoi.array().items(
              TwilioJoi.string().phoneNumber({ defaultCountry: 'US', format: 'e164' })
            )
        }

        return Joi.validate(details, schema)
    }
};
