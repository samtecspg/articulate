import Joi from 'joi';

class SettingsModel {
    static get schema() {

        return {
            id: Joi.number(),
            name: Joi.string().trim().description('Setting Name'),
            value: Joi.any().description('Setting Value (string|object|array)')
        };
    };
}

module.exports = SettingsModel;
