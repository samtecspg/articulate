import Joi from 'joi';

import {
    CONFIG_SETTINGS_ALL,
    PARAM_NAME,
    PARAM_VALUE
} from '../../util/constants';

const SettingsModel = require('../models/settings.model').schema;

class SettingsValidate {
    constructor() {

        this.create = {
            payload: (() => {

                return {
                    [PARAM_NAME]: SettingsModel.name.required().description('Name'),
                    [PARAM_VALUE]: SettingsModel.value.required().description('Value')
                };
            })()
        };
        this.findByName = {
            params: (() => {

                return {
                    [PARAM_NAME]: SettingsModel
                        .name
                        .required()
                        .allow(CONFIG_SETTINGS_ALL)
                        .description('Name')
                };
            })()
        };

        this.updateByName = {
            params: (() => {

                return {
                    [PARAM_NAME]: SettingsModel
                        .name
                        .required()
                        .allow(CONFIG_SETTINGS_ALL)
                };
            })(),
            payload: (() => {

                return SettingsModel.value.required();
            })()
        };

        this.updateAll = {
            payload: (() => {

                const keys = {};
                CONFIG_SETTINGS_ALL.forEach((key) => {

                    keys[key] = SettingsModel
                        .value
                        .optional();
                });
                return Joi.object().keys(keys);
            })()
        };

    }
}

const settingsValidate = new SettingsValidate();
module.exports = settingsValidate;
