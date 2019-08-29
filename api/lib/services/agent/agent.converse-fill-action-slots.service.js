import _ from 'lodash';
import { CONFIG_KEYWORD_TYPE_REGEX } from '../../../util/constants';

module.exports = async function ({ actionData, CSO, recognizedModifier }) {

    const { agentService, keywordService } = await this.server.services();

    if (!CSO.currentAction.slots){
        CSO.currentAction.slots = {}
    }

    actionData.slots.forEach((slot) => {
        CSO.currentAction.slots[slot.slotName] = CSO.currentAction.slots[slot.slotName] ? CSO.currentAction.slots[slot.slotName] : {
            keyword: slot.keyword,
            value: '',
            original: '',
            remainingLife: slot.remainingLife,
            promptCount: 0,
        };
    });

    //If the model recognized a modifier
    if (recognizedModifier){
        //Get the slot that is going to be modified by the modifier
        const actionSlot = _.find(actionData.slots, (slot) => {

            return slot.keyword === recognizedModifier.keyword;
        });

        //Get the slot name of the slot to modify
        const slotToModify = actionSlot.slotName;

        //Variables that are going to be used in case the source value of the modifier is the keyword value
        let recognizedKeywordsOfSameTypeThanModifierKeyword, recognizedModifierKeywordsValues;

        //Flag to indicate if the recognizedModifier will use a keyword value or a static value
        const modifierUsesKeywordValue = recognizedModifier.valueSource === 'keyword';

        //If the source value of the modifier is the keyword value coming from the model
        if (modifierUsesKeywordValue){
            //Filter the recognized keyword to get the keyword value of the recognized modifier
            recognizedKeywordsOfSameTypeThanModifierKeyword = _.filter(CSO.recognizedKeywords, (recognizedKeyword) => {

                return recognizedKeyword.keyword === recognizedModifier.keyword;
            });

            //Given that more than one value could had been reconized (i.e. toppings) get the transformed value of those recognized keywords
            recognizedModifierKeywordsValues = _.map(recognizedKeywordsOfSameTypeThanModifierKeyword, (recognizedKeyword) => {

                return keywordService.parseSysValue({ keyword: recognizedKeyword, text: CSO.text });
            });
        }

        /*
        * Perform a different operation depending on the modifier action
        * Each operation will check if the modifier uses a keyword value or a static value
        * also, it will check if the slot is a list (an array) or is single value
        */
        switch (recognizedModifier.action) {
            case 'ADD':
                if (modifierUsesKeywordValue){
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value)){
                        recognizedModifierKeywordsValues.forEach((keywordValue) => {

                            CSO.currentAction.slots[slotToModify].value.push(keywordValue.value);
                            CSO.currentAction.slots[slotToModify].original.push(keywordValue.original);
                        });
                    }
                    else {
                        CSO.currentAction.slots[slotToModify] = {
                            keyword: recognizedModifier.keyword,
                            value: CSO.currentAction.slots[slotToModify].value ? [CSO.currentAction.slots[slotToModify].value] : [],
                            original: CSO.currentAction.slots[slotToModify].original ? [CSO.currentAction.slots[slotToModify].original] : []
                        };
                        //Push the new recognized values to the list
                        recognizedModifierKeywordsValues.forEach((keywordValue) => {

                            CSO.currentAction.slots[slotToModify].value.push(keywordValue.value);
                            CSO.currentAction.slots[slotToModify].original.push(keywordValue.original);
                        });
                    }
                }
                else {
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value)){
                        CSO.currentAction.slots[slotToModify].value.push(recognizedModifier.staticValue);
                        CSO.currentAction.slots[slotToModify].original.push(recognizedModifier.staticValue);
                    }
                    else {
                        CSO.currentAction.slots[slotToModify] = {
                            keyword: recognizedModifier.keyword,
                            value: CSO.currentAction.slots[slotToModify].value ? [CSO.currentAction.slots[slotToModify].value] : [],
                            original: CSO.currentAction.slots[slotToModify].original ? [CSO.currentAction.slots[slotToModify].original] : []
                        };
                        //Push the new recognized values to the list
                        CSO.currentAction.slots[slotToModify].value.push(recognizedModifier.staticValue);
                        CSO.currentAction.slots[slotToModify].original.push(recognizedModifier.staticValue);
                    }
                }
                CSO.currentAction.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                break;
            case 'REMOVE':
                if (modifierUsesKeywordValue){
                
                    const keywordsRasaValues = _.map(recognizedModifierKeywordsValues, 'value');
                    const keywordsOriginalValues = _.map(recognizedModifierKeywordsValues, 'original');
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value)){
                        CSO.currentAction.slots[slotToModify].value = _.filter(CSO.currentAction.slots[slotToModify].value, (value) => {

                            return keywordsRasaValues.indexOf(value) === -1;
                        });
                        CSO.currentAction.slots[slotToModify].original = _.filter(CSO.currentAction.slots[slotToModify].original, (original) => {

                            return keywordsOriginalValues.indexOf(original) === -1;
                        });
                        if (CSO.currentAction.slots[slotToModify].value.length === 0){
                            CSO.currentAction.slots[slotToModify] = ''
                        }
                        CSO.currentAction.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                    }
                    else {
                        if (keywordsRasaValues.indexOf(CSO.currentAction.slots[slotToModify].value) || keywordsOriginalValues.indexOf(CSO.currentAction.slots[slotToModify].original)){
                            CSO.currentAction.slots[slotToModify] = '';
                        }
                    }
                }
                else {
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value)){
                        CSO.currentAction.slots[slotToModify].value = _.filter(CSO.currentAction.slots[slotToModify].value, (value) => {

                            return value !== recognizedModifier.staticValue;
                        });
                        CSO.currentAction.slots[slotToModify].original = _.filter(CSO.currentAction.slots[slotToModify].original, (original) => {

                            return original !== recognizedModifier.staticValue;
                        });
                        if (CSO.currentAction.slots[slotToModify].value.length === 0){
                            CSO.currentAction.slots[slotToModify] = ''
                        }
                    }
                    else {
                        if (CSO.currentAction.slots[slotToModify].value === recognizedModifier.staticValue || CSO.currentAction.slots[slotToModify].original === recognizedModifier.staticValue){
                            CSO.currentAction.slots[slotToModify] = '';
                        }
                    }
                }
                break;
            case 'SET':
                if (modifierUsesKeywordValue){
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value) || recognizedModifierKeywordsValues.length > 1){
                        CSO.currentAction.slots[slotToModify].keyword = recognizedModifier.keyword;
                        CSO.currentAction.slots[slotToModify].value = [];
                        CSO.currentAction.slots[slotToModify].original = [];
                        CSO.currentAction.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                        recognizedModifierKeywordsValues.forEach((keywordValue) => {

                            CSO.currentAction.slots[slotToModify].value.push(keywordValue.value);
                            CSO.currentAction.slots[slotToModify].original.push(keywordValue.original);
                        });
                    }
                    else {
                        if (recognizedModifierKeywordsValues.length > 0){
                            CSO.currentAction.slots[slotToModify].keyword = recognizedModifier.keyword;
                            CSO.currentAction.slots[slotToModify].value = recognizedModifierKeywordsValues[0].value;
                            CSO.currentAction.slots[slotToModify].original = recognizedModifierKeywordsValues[0].original;
                            CSO.currentAction.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                        }
                    }
                }
                else {
                    if (Array.isArray(CSO.currentAction.slots[slotToModify].value)){
                        CSO.currentAction.slots[slotToModify].keyword = recognizedModifier.keyword;
                        CSO.currentAction.slots[slotToModify].value = [];
                        CSO.currentAction.slots[slotToModify].original = [];
                        CSO.currentAction.slots[slotToModify].value.push(recognizedModifier.staticValue);
                        CSO.currentAction.slots[slotToModify].original.push(recognizedModifier.staticValue);
                    }
                    else {
                        CSO.currentAction.slots[slotToModify].keyword = recognizedModifier.keyword;
                        CSO.currentAction.slots[slotToModify].value = recognizedModifier.staticValue;
                        CSO.currentAction.slots[slotToModify].original = recognizedModifier.staticValue;
                    }
                }
                break;
            case 'UNSET':
                CSO.currentAction.slots[slotToModify] = {
                    keyword: actionSlot.keyword,
                    value: '',
                    original: '',
                    remainingLife: actionSlot.remainingLife,
                    promptCount: 0,
                };
                if (CSO.context.savedSlots[slotToModify]){
                    delete CSO.context.savedSlots[slotToModify];
                }
                break;
            default:
                break;
        }
        if (CSO.currentAction.slots[slotToModify].remainingLife > -1){
            CSO.context.savedSlots[slotToModify] = CSO.currentAction.slots[slotToModify];
        }
    }
    else {
        //Variable to keep track of slots that have been converted from single values to lists
        const overridedSlots = [];

        CSO.recognizedKeywords.forEach((recognizedKeyword) => {
            //Get the slots of the action that match the recognized keyword name with their keyword
            const slotOfRecognizedKeywords = _.filter(actionData.slots, (slot) => { return slot.keyword === recognizedKeyword.keyword });

            //We iterate over all possible fillable slots to get the best candidate
            let slotToFill = _.find(slotOfRecognizedKeywords, (slot) => { 
                const slotValueInAction = CSO.currentAction.slots[slot.slotName] ? CSO.currentAction.slots[slot.slotName].value : null;
                return (!slotValueInAction || (Array.isArray(slotValueInAction) && slotValueInAction.length === 0));
            });

            //If there is an slot that can be filled and doesn't have a value yet, then let's use that one, if not, let's use the first slot that can be filled
            slotToFill = slotToFill ? slotToFill : slotOfRecognizedKeywords[0];
            if (slotToFill) {
                //Get the slot name
                const slotName = slotToFill.slotName;
                //If the slot is a list of elemnts
                if (slotToFill.isList) {
                    //If there isn't a value for this slot name in the context
                    if (!CSO.currentAction.slots[slotName] || CSO.currentAction.slots[slotName] === '') {
                        //Get the original and parsed value of the keyword
                        const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text: CSO.text });
                        //Add these values to the context as a new slot
                        CSO.currentAction.slots[slotName] = {
                            keyword: recognizedKeyword.keyword,
                            value: keywordValue.value,
                            original: keywordValue.original,
                            remainingLife: slotToFill.remainingLife
                        };
                    }
                    //If an slot in the context already exists for the recognized slot
                    else {
                        //If the value of the slot in the context is an array (This means that if the slot is a list)
                        if (Array.isArray(CSO.currentAction.slots[slotName].value)) {
                            //If the slot haven't been overrided
                            if (overridedSlots.indexOf(slotName) === -1) {
                                //Add the slot name to the list of overrided slots
                                overridedSlots.push(slotName);
                                //And clear the context of this slot
                                CSO.currentAction.slots[slotName] = {
                                    keyword: recognizedKeyword.keyword,
                                    value: [],
                                    original: [],
                                    remainingLife: slotToFill.remainingLife
                                };
                            }
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text: CSO.text });
                            //Push the recognized values to the current context slot value and original attribute
                            CSO.currentAction.slots[slotName].value.push(keywordValue.value);
                            CSO.currentAction.slots[slotName].original.push(keywordValue.original);
                        }
                        //If the slot is a list, and it exists in the context but it wasn't an array
                        else {
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text: CSO.text });
                            //Transform the current slot in the context to an array and insert the existent values in this array
                            CSO.currentAction.slots[slotName] = {
                                keyword: recognizedKeyword.keyword,
                                value: [CSO.currentAction.slots[slotName].value],
                                original: [CSO.currentAction.slots[slotName].original],
                                remainingLife: slotToFill.remainingLife
                            };
                            //Push the new recognized values to the list
                            CSO.currentAction.slots[slotName].value.push(keywordValue.value);
                            CSO.currentAction.slots[slotName].original.push(keywordValue.original);
                            overridedSlots.push(slotName);
                        }
                    }
                }
                //If slot is not a list
                else {
                    //Just insert an object with attributes value and original into the context slot after sorting the matching regex to keep the last one
                    if (recognizedKeyword.extractor === CONFIG_KEYWORD_TYPE_REGEX) {
                        const allRecognizedKeywordsForRegex = recognizedKeywords.filter((ent) => {

                            return ent.keyword === recognizedKeyword.keyword && ent.extractor === CONFIG_KEYWORD_TYPE_REGEX;

                        });
                        allRecognizedKeywordsForRegex.sort((a, b) => {

                            return b.end - a.end;
                        });

                        CSO.currentAction.slots[slotName] = keywordService.parseSysValue({ keyword: allRecognizedKeywordsForRegex[0], text: CSO.text });
                        CSO.currentAction.slots[slotName].remainingLife = slotToFill.remainingLife;
                    }
                    else {
                        CSO.currentAction.slots[slotName] = keywordService.parseSysValue({ keyword: recognizedKeyword, text: CSO.text });
                        CSO.currentAction.slots[slotName].remainingLife = slotToFill.remainingLife;

                    }

                }
                if (CSO.currentAction.slots[slotName].remainingLife > -1){
                    CSO.context.savedSlots[slotName] = CSO.currentAction.slots[slotName];
                }
            }
        });
    }

    await agentService.converseFulfillEmptySlotsWithSavedValues({ CSO });
};