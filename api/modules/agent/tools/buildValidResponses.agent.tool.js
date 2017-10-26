'use strict';

const _ = require('lodash');
const GetEntityValue = require('./getEntityValue.agent.tool');

const replaceText = (response, entity, entityValue) => {

    const oldResponseText = response.text;
    response.text =  response.text.replace('$' + entity, entityValue);
    if (!response.template && response.text !== response) {
        response.template = true;
    }
    if (oldResponseText !== response.text) {
        response.numberOfReplacements++;
    }
    return response;
};

module.exports = (recognizedEntities, context, slots, responses, timezone) => {

    const buildedResponses = _.map(responses, (response) => {

        let tempResponse = {
            template: false,
            text: response,
            numberOfReplacements: 0 //Used to select responses with the max amount of slots filled
        };
        recognizedEntities.forEach( (entity) => {

            tempResponse = replaceText(tempResponse, entity, GetEntityValue(entity, timezone));
        });
        Object.keys(context.slots).forEach( (entity) => {

            if (context.slots[entity]) {
                tempResponse = replaceText(tempResponse, entity, context.slots[entity]);
            }
        });
        let isValid = true;
        if (slots){
            slots.forEach( (slot) => {

                if (tempResponse.text.indexOf('$' + slot.entity) !== -1) {
                    isValid = false;
                }
            });
        }
        return isValid ? tempResponse : null;
    });

    const validResponses = _.compact(buildedResponses);
    const maxNumberOfReplacements = _.max(_.map(validResponses, 'numberOfReplacements'));
    const templatedResponses = _.filter(validResponses, (response) => {

        return response.template && response.numberOfReplacements === maxNumberOfReplacements;
    });
    const finalResponses = templatedResponses.length > 0 ? templatedResponses : validResponses;
    return _.map(finalResponses, 'text');
};
