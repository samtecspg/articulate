'use strict';

const _ = require('lodash');

const RespondFulfilledIntent = require('./respondFulfilledIntent.agent.tool');
const PromptMissingEntity = require('./promptMissingEntity.agent.tool');
const GetEntityValue = require('./getEntityValue.agent.tool');

module.exports = (conversationStateObject, callback) => {

    //If there are slots in the scenario
    if (conversationStateObject.scenario.slots && conversationStateObject.scenario.slots.length > 0) {
        //Create an array of slot names
        const intentSlotNames = _.map(conversationStateObject.scenario.slots, 'slotName');
        //Create an array of entity names for each slot, with the same indexes than the previous array
        const intentSlotEntitiesNames = _.map(conversationStateObject.scenario.slots, 'entity');
        //Create an array of required slots (retrieve the full slot object)
        const requiredSlots = _.filter(conversationStateObject.scenario.slots, (slot) => {

            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slot.slotName] = conversationStateObject.currentContext.slots[slot.slotName] ? conversationStateObject.currentContext.slots[slot.slotName] : '';
            return slot.isRequired;
        });
        //Create an array of slot names for slots that are lists
        const isListSlots = _.map(_.filter(conversationStateObject.scenario.slots, (slot) => {

            return slot.isList;
        }), 'slotName');
        //Extract the recognized entities from the text parse
        //Create an array of slots that existed before and are being overrided because of a new text parse
        const recognizedEntities = conversationStateObject.rasaResult.entities;
        const overridedSlots = [];
        //Iterate over each recognized entity
        const recognizedEntitiesNames = _.map(recognizedEntities, (recognizedEntity) => {

            //If the name of the recognized entity match with an entity name of an slot
            if (intentSlotEntitiesNames.indexOf(recognizedEntity.entity) > -1) {
                //Get the slot name of the entity that was recognized using the index of the array of entities names
                const slotName = intentSlotNames[intentSlotEntitiesNames.indexOf(recognizedEntity.entity)];
                //If the slot is a list of elemnts
                if (isListSlots.indexOf(slotName) > -1) {
                    //If there isn't a value for this slot name in the context
                    if (!conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] || conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] === '') {
                        //Get the original and parsed value of the entity
                        const entityValue = GetEntityValue(recognizedEntity, conversationStateObject.text);
                        //Add these values to the context as a new slot
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                            value: entityValue.value,
                            original: entityValue.original
                        };
                    }
                    //If an slot in the context already exists for the recognized slot
                    else {
                        //If the value of the slot in the context is an array (This means that if the slot is a list)
                        if (Array.isArray(conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value)) {
                            //If the slot haven't been overrided
                            if (overridedSlots.indexOf(slotName) === -1) {
                                //Add the slot name to the list of overrided slots
                                overridedSlots.push(slotName);
                                //And clear the context of this slot
                                conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                                    value: [],
                                    original: []
                                };
                            }
                            //Get the original and parsed value of the entity
                            const entityValue = GetEntityValue(recognizedEntity, conversationStateObject.text);
                            //Push the recognized values to the current context slot value and original attribute
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value.push(entityValue.value);
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original.push(entityValue.original);
                        }
                        //If the slot is a list, and it exists in the context but it wasn't an array
                        else {
                            //Get the original and parsed value of the entity
                            const entityValue = GetEntityValue(recognizedEntity, conversationStateObject.text);
                            //Transform the current slot in the context to an array and insert the existent values in this array
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                                value: [conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value],
                                original: [conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original]
                            };
                            //Push the new recognized values to the list
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value.push(entityValue.value);
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original.push(entityValue.original);
                            overridedSlots.push(slotName);
                        }
                    }
                }
                //If slot is not a list
                else {
                    //Just insert an object with attributes value and original into the context slot after sorting the matching regex to keep the last one
                    if (recognizedEntity.extractor === 'regex') {
                        const allRecognizedEntitiesForRegex = recognizedEntities.filter((ent) => {

                            return ent.entity === recognizedEntity.entity && ent.extractor === 'regex';

                        });
                        allRecognizedEntitiesForRegex.sort((a, b) => {

                            return b.end - a.end;
                        });
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = GetEntityValue(allRecognizedEntitiesForRegex[0], conversationStateObject.text);
                    }
                    else {
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = GetEntityValue(recognizedEntity, conversationStateObject.text);

                    }

                }
            }
            //Finally return the name of the recognized entity for further checks
            return recognizedEntity.entity;
        });
        const missingEntities = _.filter(requiredSlots, (slot) => {

            return recognizedEntitiesNames.indexOf(slot.entity) === -1 && !conversationStateObject.currentContext.slots[slot.slotName];
        });
        conversationStateObject.slots = conversationStateObject.currentContext.slots;
        if (missingEntities.length > 0) {
            PromptMissingEntity(conversationStateObject, missingEntities[0], (err, response) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
        else {
            RespondFulfilledIntent(conversationStateObject, (err, response) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
    }
    else {
        RespondFulfilledIntent(conversationStateObject, (err, response) => {

            if (err) {
                return callback(err, null);
            }
            return callback(null, response);
        });
    }
};
