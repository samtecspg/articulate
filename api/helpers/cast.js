'use strict';
const _ = require('lodash');

module.exports = (object, type) => {

    switch (type) {

        case 'agent':
            if (typeof object.useWebhook !== 'boolean'){
                object.useWebhook = object.useWebhook === 'true';
            }
            if (typeof object.usePostFormat !== 'boolean'){
                object.usePostFormat = object.usePostFormat === 'true';
            }
            if (typeof object.extraTrainingData !== 'boolean'){
                object.extraTrainingData = object.extraTrainingData === 'true';
            }
            if (typeof object.enableModelsPerDomain !== 'boolean'){
                object.enableModelsPerDomain = object.enableModelsPerDomain === 'true';
            }
            object.domainClassifierThreshold = parseFloat(object.domainClassifierThreshold);
            break;
        case 'context':
            break;
        case 'domain':
            if (typeof object.enabled !== 'boolean'){
                object.enabled = object.enabled === 'true';
            }
            if (typeof object.extraTrainingData !== 'boolean'){
                object.extraTrainingData = object.extraTrainingData === 'true';
            }
            object.intentThreshold = parseFloat(object.intentThreshold);
            break;
        case 'entity':
            if (object.regex === '' || !object.regex || object.regex === 'null'){
                object.regex = null;
            }
            break;
        case 'intent':
            if (typeof object.useWebhook !== 'boolean'){
                object.useWebhook = object.useWebhook === 'true';
            }

            if (typeof object.usePostFormat !== 'boolean'){
                object.usePostFormat = object.usePostFormat === 'true';
            }
            object.examples = object.examples.map((example) => {

                if (example.entities === '') {
                    example.entities = [];
                }
                else {
                    example.entities = example.entities.map((entity) => {

                        if (entity.entityId) {
                            entity.entityId = parseInt(entity.entityId);
                        }
                        entity.start = parseInt(entity.start);
                        entity.end = parseInt(entity.end);
                        return entity;
                    });
                }
                return example;
            });
            break;
        case 'scenario':
            if (object.slots === '') {
                object.slots = [];
            }
            else {
                object.slots = object.slots.map((slot) => {

                    if (!_.isArray(slot.textPrompts)) {
                        slot.textPrompts = [];
                    }
                    if (typeof object.isList !== 'boolean'){
                        slot.isList = slot.isList === 'true';
                    }
                    if (typeof object.isRequired !== 'boolean'){
                        slot.isRequired = slot.isRequired === 'true';
                    }
                    return slot;
                });
            }
            if (object.intentResponses === '') {
                if (object.intentResponses.length === 0) {
                    object.intentResponses = [];
                }
            }
            break;
        case 'webhook':
            break;
        case 'postFormat':
            break;
        case 'settings':
            const newObject = [];
            Object.keys(object).forEach((key) => {

                newObject.push(object[key]);
            });
            object = newObject;
            break;
        case 'document':
            if (object.result && object.result.results){
                object.result.results.forEach((result) => {

                    if (result.intent){
                        if (result.intent.name && (result.intent.name === '' || result.intent.name === 'null')){
                            result.intent.name = null;
                        }
                    }
                    if (result.entities !== undefined && result.entities !== null){
                        if (Array.isArray(result.entities)){
                            result.entities.forEach((entity) => {

                                if (entity.confidence === ''){
                                    entity.confidence = null;
                                }
                            });
                        }
                        else {
                            result.entities = [];
                        }
                    }
                });
            }
            break;
    }
    ;
    if (object.id) {
        object.id = parseInt(object.id);
    }
    return object;
};
