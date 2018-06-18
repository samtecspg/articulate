'use strict';

const Joi = require('joi');

class SettingsValidate {
    constructor() {

        this.update = {
            payload: (() => {

                return Joi.object();
            })()
        };

        this.findAll = { };

        this.findSettingsByName = {
            params: (() => {

                return {
                    name: Joi.string().required().description('The name of the setting')
                };
            })()
        };

    }
}

const settingsValidate = new SettingsValidate();
module.exports = settingsValidate;
