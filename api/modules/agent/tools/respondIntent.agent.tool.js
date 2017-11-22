'use strict';

const _ = require('lodash');

const RespondFulfilledIntent = require('./respondFulfilledIntent.agent.tool');
const PromptMissingEntity = require('./promptMissingEntity.agent.tool');
const GetEntityValue = require('./getEntityValue.agent.tool');

module.exports = (context, currentContext, intent, scenario, parseResult, timezone, webhookUrl, callback) => {

    if (scenario.slots && scenario.slots.length > 0) {
        const intentSlotNames = _.map(scenario.slots, 'entity');
        const requiredSlots = _.filter(scenario.slots, (slot) => {

            context[context.length - 1].slots[slot.entity] = currentContext.slots[slot.entity] ? currentContext.slots[slot.entity] : null;
            return slot.isRequired;
        });
        const recognizedEntities = parseResult.entities;
        const recognizedEntitiesNames = _.map(recognizedEntities, (recognizedEntity) => {

            if (intentSlotNames.indexOf(recognizedEntity.entity) > -1) {
                context[context.length - 1].slots[recognizedEntity.entity] = GetEntityValue(recognizedEntity, timezone);
            }
            return recognizedEntity.entity;
        });
        const missingEntities = _.filter(requiredSlots, (slot) => {

            return recognizedEntitiesNames.indexOf(slot.entity) === -1 && !currentContext.slots[slot.entity];
        });
        if (missingEntities.length > 0) {
            PromptMissingEntity(currentContext, scenario, missingEntities[0], recognizedEntities, timezone, webhookUrl, (err, response) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
        else {
            RespondFulfilledIntent(currentContext, scenario, timezone, webhookUrl, (err, response) => {

                if (err){
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
    }
    else {
        RespondFulfilledIntent(currentContext, scenario, timezone, webhookUrl, (err, response) => {

            if (err){
                return callback(err, null);
            }
            return callback(null, response);
        });
    }
};
