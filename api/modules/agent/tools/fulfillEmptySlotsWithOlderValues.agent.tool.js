'use strict';
const _ = require('lodash');

module.exports = (conversationStateObject) => {

    conversationStateObject.scenario.slots.forEach(scenarioSlot => {

        if (!conversationStateObject.currentContext.slots[scenarioSlot.slotName]){ //if an scenario have an slot that is not fulfilled in the current context
            let latestAliveValue = _.filter(conversationStateObject.context, (frame) => {

                return frame.slots && frame.slots[scenarioSlot.slotName] && frame.slots[scenarioSlot.slotName].lifespan > 0;
            });
            latestAliveValue = latestAliveValue.length > 0 ? latestAliveValue[latestAliveValue.length -1].slots[scenarioSlot.slotName] : null;
            if (latestAliveValue){
                conversationStateObject.currentContext.slots[scenarioSlot.slotName] = latestAliveValue;
            }
        }
    });
};
