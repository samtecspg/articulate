import _ from 'lodash';

module.exports = function ({ conversationStateObject }) {

    Object.keys(conversationStateObject.currentFrame.slots).forEach(currentFrameSlot => {
        
        const slotValue = conversationStateObject.currentFrame.slots[currentFrameSlot];
        //if the recognized action have an slot that is not fulfilled in the current context
        if (!slotValue || (Array.isArray(slotValue) && slotValue.length > 0)){ 
            let aliveSlot = _.filter(Object.keys(conversationStateObject.context.savedSlots), (savedSlot) => {

                return savedSlot === currentFrameSlot && conversationStateObject.context.savedSlots[savedSlot].remainingLife > 0;
            });
            aliveSlot = aliveSlot.length > 0 ? aliveSlot : null;
            if (aliveSlot){
                conversationStateObject.currentFrame.slots[currentFrameSlot] = conversationStateObject.context.savedSlots[aliveSlot];
            }
        }
    });
};