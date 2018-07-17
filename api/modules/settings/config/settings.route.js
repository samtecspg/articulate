'use strict';
const SettingsController = require('../controllers');
const SettingsValidator = require('./settings.validator');
const PKG = require('../../../package');

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
            description: 'Return all the settings of the system',
            tags: ['api'],
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/settings.find-all.graph`,
                    consumes: ['redis']
                }
            },
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
            plugins: {
                'flow-loader': {
                    name: `${PKG.name}/settings.find-by-name.graph`,
                    consumes: ['redis']
                }
            },
            validate: SettingsValidator.findSettingsByName,
            handler: SettingsController.findSettingsByName
        }
    }
];

module.exports = settingsRoutes;
