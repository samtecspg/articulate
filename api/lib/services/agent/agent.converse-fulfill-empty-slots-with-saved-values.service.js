import _ from 'lodash';

module.exports = async function ({ CSO }) {

    Object.keys(CSO.currentAction.slots).forEach(currentActionSlot => {
        
        const slotValue = CSO.currentAction.slots[currentActionSlot].value;
        //if the recognized action have an slot that is not fulfilled in the current context
        if (!slotValue || (Array.isArray(slotValue) && slotValue.length > 0)){ 
            let aliveSlot = _.find(Object.keys(CSO.context.savedSlots), (savedSlot) => {

                return savedSlot === currentActionSlot && CSO.context.savedSlots[savedSlot].remainingLife > 0;
            });
            if (aliveSlot){
                CSO.currentAction.slots[currentActionSlot] = CSO.context.savedSlots[aliveSlot];
            }
        }
    });
};