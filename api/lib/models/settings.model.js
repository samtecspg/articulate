import Joi from 'joi';

class SettingsModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string().trim().description('Setting Name'),
            value: Joi.alternatives().try(Joi.array(), Joi.string(), Joi.object(), Joi.number(), Joi.boolean()).description('Setting Value (string|object|array|boolean)')
        };
    };
}

module.exports = SettingsModel;
