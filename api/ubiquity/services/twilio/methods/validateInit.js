const Joi = require('joi');
const TwilioJoi = Joi.extend(require('joi-phone-number'));

module.exports = (payload) => {
  const schema = TwilioJoi.object().keys({
    agent: TwilioJoi.number().required(),
    service: TwilioJoi.string().required(),
    details: TwilioJoi.object().keys({
      authToken: TwilioJoi.string().required(),
      whiteList: TwilioJoi.array().items(
        TwilioJoi.string().phoneNumber({ defaultCountry: 'US', format: 'e164' })
      )
    })
  })

  return TwilioJoi.validate(payload, schema);
}