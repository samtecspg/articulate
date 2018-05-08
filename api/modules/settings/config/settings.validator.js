'use strict';

const SettingsSchema = require('../../../models/index').Settings.schema;

class SettingsValidate {
    constructor() {

        this.updateUILanguage = {
            payload: (() => {

                return {
                    uiLanguage: SettingsSchema.uiLanguage.required().error(new Error('Please specify the ui langauge'))
                };
            })()
        };

        this.updateDomainClassifierPipeline = {
            payload: (() => {

                return SettingsSchema.domainClassifierPipeline.min(1).error(new Error('Please add at least one processor to the pipeline. Rasa don\'t allows empty pipelines'));
            })()
        };

        this.updateIntentClassifierPipeline = {
            payload: (() => {

                return SettingsSchema.intentClassifierPipeline.min(1).error(new Error('Please add at least one processor to the pipeline. Rasa don\'t allows empty pipelines'));
            })()
        };

        this.updateEntityClassifierPipeline = {
            payload: (() => {

                return SettingsSchema.entityClassifierPipeline.min(1).error(new Error('Please add at least one processor to the pipeline. Rasa don\'t allows empty pipelines'));
            })()
        };

        this.findAll = { };

        this.findUILanguage = { };

        this.findDomainClassifierPipeline = { };

        this.findIntentClassifierPipeline = { };

        this.findEntityClassifierPipeline = { };

    }
}

const settingsValidate = new SettingsValidate();
module.exports = settingsValidate;
