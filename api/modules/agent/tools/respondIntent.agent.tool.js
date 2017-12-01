'use strict';

const _ = require('lodash');

const RespondFulfilledIntent = require('./respondFulfilledIntent.agent.tool');
const PromptMissingEntity = require('./promptMissingEntity.agent.tool');
const GetEntityValue = require('./getEntityValue.agent.tool');

module.exports = (userText, context, currentContext, intent, scenario, parseResult, timezone, webhookUrl, callback) => {

    if (scenario.slots && scenario.slots.length > 0) {
        const intentSlotNames = _.map(scenario.slots, 'slotName');
        const intentSlotEntitiesNames = _.map(scenario.slots, 'entity');
        const requiredSlots = _.filter(scenario.slots, (slot) => {

            context[context.length - 1].slots[slot.slotName] = currentContext.slots[slot.slotName] ? currentContext.slots[slot.slotName] : null;
            return slot.isRequired === 'true';
        });
        const isListSlots = _.map(_.filter(scenario.slots, (slot) => {

            return slot.isList === 'true';
        }), 'slotName');
        const recognizedEntities = parseResult.entities;
        const overridedSlots = [];
        const recognizedEntitiesNames = _.map(recognizedEntities, (recognizedEntity) => {

            if (intentSlotEntitiesNames.indexOf(recognizedEntity.entity) > -1) {
                const slotName = intentSlotNames[intentSlotEntitiesNames.indexOf(recognizedEntity.entity)];
                if (isListSlots.indexOf(slotName) > -1){
                    if (!context[context.length - 1].slots[slotName]){
                        const entityValue = GetEntityValue(recognizedEntity, userText)
                        context[context.length - 1].slots[slotName] = {
                            value: [entityValue.value],
                            original: [entityValue.original]
                        }
                    }
                    else {
                        if (Array.isArray(context[context.length - 1].slots[slotName].value)){
                            if (overridedSlots.indexOf(slotName) === -1){
                                overridedSlots.push(slotName);
                                context[context.length - 1].slots[slotName] = {
                                    value: [],
                                    original: []
                                }
                            }
                            const entityValue = GetEntityValue(recognizedEntity, userText)
                            context[context.length - 1].slots[slotName].value.push(entityValue.value);
                            context[context.length - 1].slots[slotName].original.push(entityValue.original);
                        }
                        else {
                            const entityValue = GetEntityValue(recognizedEntity, userText)
                            context[context.length - 1].slots[slotName] = {
                                value: [context[context.length - 1].slots[slotName].value],
                                original: [context[context.length - 1].slots[slotName].original]
                            };
                            context[context.length - 1].slots[slotName].value.push(entityValue.value);
                            context[context.length - 1].slots[slotName].original.push(entityValue.original);
                        }
                    }
                }
                else {
                    context[context.length - 1].slots[slotName] = GetEntityValue(recognizedEntity, userText);
                }
            }
            else{
                if (recognizedEntity.entity.indexOf('sys.spacy_')  !== -1 || recognizedEntity.entity.indexOf('sys.duckling_') !== -1) {
                    context[context.length - 1].slots = context[context.length - 1].slots ? context[context.length - 1].slots : {};
                    context[context.length - 1].slots.sys = context[context.length - 1].slots.sys ? context[context.length - 1].slots.sys : {};
                    context[context.length - 1].slots.sys[recognizedEntity.entity.replace('sys.','')] = GetEntityValue(recognizedEntity, userText);
                }
            }
            return recognizedEntity.entity;
        });
        const missingEntities = _.filter(requiredSlots, (slot) => {

            return recognizedEntitiesNames.indexOf(slot.entity) === -1 && !currentContext.slots[slot.slotName];
        });
        if (missingEntities.length > 0) {
            PromptMissingEntity(userText, currentContext, scenario, missingEntities[0], recognizedEntities, timezone, webhookUrl, (err, response) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
        else {
            RespondFulfilledIntent(userText, currentContext, scenario, timezone, webhookUrl, (err, response) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
    }
    else {
        const recognizedEntities = parseResult.entities;
        _.map(recognizedEntities, (recognizedEntity) => {

            if (recognizedEntity.entity.indexOf('sys.spacy_') !== -1 || recognizedEntity.entity.indexOf('sys.duckling_') !== -1) {
                context[context.length - 1].slots = context[context.length - 1].slots ? context[context.length - 1].slots : {};
                context[context.length - 1].slots.sys = context[context.length - 1].slots.sys ? context[context.length - 1].slots.sys : {};
                context[context.length - 1].slots.sys[recognizedEntity.entity.replace('sys.','')] = GetEntityValue(recognizedEntity, userText);
            }
            return recognizedEntity.entity;
        });
        RespondFulfilledIntent(userText, currentContext, scenario, timezone, webhookUrl, (err, response) => {

            if (err){
                return callback(err, null);
            }
            return callback(null, response);
        });
    }
};
