'use strict';
const SettingsController = require('../controllers');
const SettingsValidator = require('./settings.validator');

const settingsRoutes = [
    {
        method: 'PUT',
        path: '/settings',
        config: {
            description: 'Modifies the settings',
            tags: ['api'],
            validate: SettingsValidator.update,
            handler: SettingsController.update
        }
    },
    {
        method: 'GET',
        path: '/settings',
        config: {
            description: 'Return all the setings of the system',
            tags: ['api'],
            validate: SettingsValidator.findAll,
            handler: SettingsController.findAll
        }
    },
    {
        method: 'GET',
        path: '/settings/{name}',
        config: {
            description: 'Return the settings value for the specified name',
            tags: ['api'],
            validate: SettingsValidator.findSettingsByName,
            handler: SettingsController.findSettingsByName
        }
    }
];

module.exports = settingsRoutes;
