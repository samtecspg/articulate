import Joi from 'joi';

module.exports = {
    create: ( details ) => {
        const schema = {
            rocketchatURL: Joi.string().required(),
            rocketchatRoom: Joi.array().items(Joi.string()).required(),
            rocketchatAuth: Joi.string().required(),
            rocketchatUser: Joi.string().required(),
            rocketchatPassword: Joi.string().required(),
            rocketchatUseSSL: Joi.boolean().required(),
            respondToDM: Joi.boolean().required(),
            respondToEdited: Joi.boolean().required(),
            respondToLivechat: Joi.boolean().required(),
            listenOnAllPublic: Joi.boolean().required()
        };

        return Joi.validate(details, schema)
    }
};
