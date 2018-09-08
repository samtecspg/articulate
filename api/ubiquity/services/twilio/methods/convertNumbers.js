const Joi = require('joi');
const TwilioJoi = Joi.extend(require('joi-phone-number'));

module.exports = (number) => {

  return TwilioJoi.string().phoneNumber({ defaultCountry: 'US', format: 'e164' }).validate(number)
}