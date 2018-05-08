'use strict';
const UpdateDomainClassifierPipelineController = require('./putDomainClassifierPipeline.settings.controller');
const UpdateIntentClassifierPipelineController = require('./putIntentClassifierPipeline.settings.controller');
const UpdateEntityClassifierPipelineController = require('./putEntityClassifierPipeline.settings.controller');
const UpdateUILanguageController = require('./putUILanguage.settings.controller');
const FindDomainClassifierPipelineController = require('./findDomainClassifierPipeline.settings.controller');
const FindIntentClassifierPipelineController = require('./findIntentClassifierPipeline.settings.controller');
const FindEntityClassifierPipelineController = require('./findEntityClassifierPipeline.settings.controller');
const FindUILanguageController = require('./findUILanguage.settings.controller');
const FindAllController = require('./findAll.settings.controller');

const SettingsController = {

    updateDomainClassifierPipeline: UpdateDomainClassifierPipelineController,

    updateIntentClassifierPipeline: UpdateIntentClassifierPipelineController,

    updateEntityClassifierPipeline: UpdateEntityClassifierPipelineController,

    updateUILanguage: UpdateUILanguageController,

    findDomainClassifierPipeline: FindDomainClassifierPipelineController,

    findIntentClassifierPipeline: FindIntentClassifierPipelineController,

    findEntityClassifierPipeline: FindEntityClassifierPipelineController,

    findUILanguage: FindUILanguageController,

    findAll: FindAllController
};

module.exports = SettingsController;
