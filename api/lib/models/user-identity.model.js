import Joi from 'joi';

class UserIdentityModel {
    static get schema() {

        return {
            id: Joi.number(),
            provider: Joi.string().trim().description('Provider'),
            token: Joi.string().trim().description('Token'),
            secret: Joi.string().trim().description('Secret'),
            profile: Joi.object().description('Profile')
        };
    };
}

module.exports = UserIdentityModel;
