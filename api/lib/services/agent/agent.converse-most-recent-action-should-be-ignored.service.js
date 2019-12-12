import _ from 'lodash';

module.exports = function ({ actionData, CSO, newActionIndex, getActionData }) {

    var mostRecentActionShouldBeIgnored = false;
    if (CSO.actionIndex === 0
        && CSO.recognizedModifiers.length === 0
        && CSO.recognizedKeywords.length > 0
        && CSO.recognizedActions.length > 0
        //&& actionWillBeFilled({
        //    actionData,
        //    action: CSO.context.actionQueue[newActionIndex],
        //    recognizedKeywords: CSO.recognizedKeywords
        //})
    ) {
        mostRecentActionShouldBeIgnored = candidateForKeywordFillingExists({ CSO, newActionIndex, getActionData });
    }
    return mostRecentActionShouldBeIgnored;
};

const candidateForKeywordFillingExists = ({ CSO, newActionIndex, getActionData }) => {
    var candidateExists = false;
    var actionData;
    candidateExists = CSO.context.actionQueue.some((action, index) => {
        actionData = getActionData({ actionName: action.name, CSO });
        if (action.fulfilled
            || action.name !== CSO.context.actionQueue[newActionIndex].name
            || index === newActionIndex) {
            return false;
        }
        return actionWillBeFilled({ actionData, action, recognizedKeywords: CSO.recognizedKeywords, newActionIndex })
    });
    return candidateExists;
};

const actionWillBeFilled = ({ actionData, action, recognizedKeywords }) => {
    if (actionData.slots) {
        var recognizedKeywordsNames = recognizedKeywords.map(keyword => keyword.keyword);
        var emptyRequiredSlotsKeywordsNames = getEmptyRequiredSlots(action.slots, actionData.slots)
        return emptyRequiredSlotsKeywordsNames.some(emptyRequiredSlotKeywordName => recognizedKeywordsNames.indexOf(emptyRequiredSlotKeywordName) > -1);
    } else {
        return false;
    }
}

const getEmptyRequiredSlots = (actionQueueSlots, actionDataSlots) => {
    var emptyRequiredSlots = [];
    var filledRequiredSlots = [];
    var requiredActionDataSlots = actionDataSlots.map(action => {
        if (action.isRequired) {
            return action.keyword;
        }
    })
    if (actionQueueSlots) {
        Object.keys(actionQueueSlots).forEach(function (slotKey) {
            if (actionQueueSlots[slotKey].original || actionQueueSlots[slotKey].value) {
                filledRequiredSlots.push(actionQueueSlots[slotKey].keyword);
            }
        });
    }
    emptyRequiredSlots = requiredActionDataSlots.filter(slot => !filledRequiredSlots.includes(slot));
    return emptyRequiredSlots;
}

