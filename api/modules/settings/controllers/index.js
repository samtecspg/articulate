'use strict';
const UpdateController = require('./putSettings.settings.controller');
const FindSettingsByNameController = require('./findSettingsByName.settings.controller');
const FindAllController = require('./findAll.settings.controller');

const SettingsController = {

    update: UpdateController,

    findSettingsByName: FindSettingsByNameController,

    findAll: FindAllController
};

module.exports = SettingsController;
