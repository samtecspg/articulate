'use strict';
const SettingsController = require('../controllers');
const SettingsValidator = require('./settings.validator');

const settingsRoutes = [
    {
        method: 'PUT',
        path: '/settings/uiLanguage',
        config: {
            description: 'Modifies the default ui language',
            tags: ['api'],
            validate: SettingsValidator.updateUILanguage,
            handler: SettingsController.updateUILanguage
        }
    },
    {
        method: 'PUT',
        path: '/settings/domainClassifierPipeline',
        config: {
            description: 'Modifies the default domain classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.updateDomainClassifierPipeline,
            handler: SettingsController.updateDomainClassifierPipeline
        }
    },
    {
        method: 'PUT',
        path: '/settings/intentClassifierPipeline',
        config: {
            description: 'Modifies the default intent classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.updateIntentClassifierPipeline,
            handler: SettingsController.updateIntentClassifierPipeline
        }
    },
    {
        method: 'PUT',
        path: '/settings/entityClassifierPipeline',
        config: {
            description: 'Modifies the default entity classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.updateEntityClassifierPipeline,
            handler: SettingsController.updateEntityClassifierPipeline
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
        path: '/settings/uiLanguage',
        config: {
            description: 'Return the default ui language',
            tags: ['api'],
            validate: SettingsValidator.findUILanguage,
            handler: SettingsController.findUILanguage
        }
    },
    {
        method: 'GET',
        path: '/settings/domainClassifierPipeline',
        config: {
            description: 'Return the default domain classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.findDomainClassifierPipeline,
            handler: SettingsController.findDomainClassifierPipeline
        }
    },
    {
        method: 'GET',
        path: '/settings/intentClassifierPipeline',
        config: {
            description: 'Return the default intent classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.findIntentClassifierPipeline,
            handler: SettingsController.findIntentClassifierPipeline
        }
    },
    {
        method: 'GET',
        path: '/settings/entityClassifierPipeline',
        config: {
            description: 'Return the default entity classifier pipeline',
            tags: ['api'],
            validate: SettingsValidator.findEntityClassifierPipeline,
            handler: SettingsController.findEntityClassifierPipeline
        }
    }
];

module.exports = settingsRoutes;
