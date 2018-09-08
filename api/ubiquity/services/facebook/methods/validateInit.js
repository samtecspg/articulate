const Joi = require('joi');

module.exports = (payload) => {
  const schema = Joi.object().keys({
    agent: Joi.number().required(),
    service: Joi.string().required(),
    details: Joi.object().keys({
      pageToken: Joi.string().required(),
      appSecret: Joi.string().required()
    })
  })

  return Joi.validate(request.payload, schema);
}