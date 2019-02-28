import _ from 'lodash';
import {
    CONFIG_KEYWORD_TYPE_REGEX,
    MODEL_ACTION,
    MODEL_AGENT,
    MODEL_WEBHOOK
} from '../../../util/constants';

module.exports = async function ({ conversationStateObject, requestId = null }) {

    const { agentService, keywordService, globalService } = await this.server.services();
    //TODO: need to refactor the CSO creation since is no longer passed to other functions
    //const conversationStateObject = { agent, action, context, currentFrame, rasaResult, text };
    const { agent, action, context, currentFrame, rasaResult, text, modifier } = conversationStateObject;
    //TODO: remove context update, and move it somewhere else
    const lastFrame = context.frames[context.frames.length - 1];
    if (action.slots && action.slots.length > 0) {
        const requiredSlots = _.filter(action.slots, (slot) => {

            lastFrame.slots[slot.slotName] = currentFrame.slots[slot.slotName] ? currentFrame.slots[slot.slotName] : '';
            return slot.isRequired;
        });
        const isListActionSlotName = _.map(_.filter(action.slots, (slot) => {

            return slot.isList;
        }), 'slotName');
        //Create an array of slots that existed before and are being overrided because of a new text parse
        const recognizedKeywords = rasaResult.keywords;
        const overridedSlots = [];
        if (modifier) {
            const actionSlot = _.filter(action.slots, (slot) => {

                return slot.keyword === modifier.keyword;
            })[0];
            const slotToModify = actionSlot.slotName;
            if (modifier.valueSource === 'keyword') {
                const recognizedKeywordsOfSameTypeThanModifierKeyword = _.filter(recognizedKeywords, (recognizedKeyword) => {

                    return recognizedKeyword.keyword === modifier.keyword;
                });
                const recognizedModifierKeywordsValues = _.map(recognizedKeywordsOfSameTypeThanModifierKeyword, (recognizedKeyword) => {

                    return keywordService.parseSysValue({ keyword: recognizedKeyword, text, requestId });
                });
                switch (modifier.action) {
                    case 'ADD':
                        if (Array.isArray(lastFrame.slots[slotToModify].value)) {
                            recognizedModifierKeywordsValues.forEach((keywordValue) => {

                                lastFrame.slots[slotToModify].value.push(keywordValue.value);
                                lastFrame.slots[slotToModify].original.push(keywordValue.original);
                                lastFrame.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                            });
                        }
                        else {
                            lastFrame.slots[slotToModify] = {
                                keyword: modifier.keyword,
                                value: lastFrame.slots[slotToModify].value ? [lastFrame.slots[slotToModify].value] : [],
                                original: lastFrame.slots[slotToModify].original ? [lastFrame.slots[slotToModify].original] : [],
                                remainingLife: actionSlot.remainingLife
                            };
                            //Push the new recognized values to the list
                            recognizedModifierKeywordsValues.forEach((keywordValue) => {

                                lastFrame.slots[slotToModify].value.push(keywordValue.value);
                                lastFrame.slots[slotToModify].original.push(keywordValue.original);
                                lastFrame.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                            });
                        }
                        break;
                    case 'REMOVE':
                        const keywordsRasaValues = _.map(recognizedModifierKeywordsValues, 'value');
                        const keywordsOriginalValues = _.map(recognizedModifierKeywordsValues, 'original');
                        if (Array.isArray(lastFrame.slots[slotToModify].value)) {
                            lastFrame.slots[slotToModify].value = _.filter(lastFrame.slots[slotToModify].value, (value) => {

                                return keywordsRasaValues.indexOf(value) === -1;
                            });
                            lastFrame.slots[slotToModify].original = _.filter(lastFrame.slots[slotToModify].original, (original) => {

                                return keywordsOriginalValues.indexOf(original) === -1;
                            });
                            if (lastFrame.slots[slotToModify].value.length === 0) {
                                lastFrame.slots[slotToModify] = '';
                            }
                            lastFrame.slots[slotToModify].remainingLife = actionSlot.remainingLife;
                        }
                        else {
                            if (keywordsRasaValues.indexOf(lastFrame.slots[slotToModify].value) || keywordsOriginalValues.indexOf(lastFrame.slots[slotToModify].original)) {
                                lastFrame.slots[slotToModify] = '';
                            }
                        }
                        break;
                    case 'SET':
                        if (Array.isArray(lastFrame.slots[slotToModify].value) || recognizedModifierKeywordsValues.length > 1) {
                            lastFrame.slots[slotToModify] = {
                                keyword: modifier.keyword,
                                value: [],
                                original: [],
                                remainingLife: actionSlot.remainingLife
                            };
                            recognizedModifierKeywordsValues.forEach((keywordValue) => {

                                lastFrame.slots[slotToModify].value.push(keywordValue.value);
                                lastFrame.slots[slotToModify].original.push(keywordValue.original);
                            });
                        }
                        else {
                            if (recognizedModifierKeywordsValues.length > 0) {
                                lastFrame.slots[slotToModify] = {
                                    keyword: modifier.keyword,
                                    value: recognizedModifierKeywordsValues[0].value,
                                    original: recognizedModifierKeywordsValues[0].original,
                                    remainingLife: actionSlot.remainingLife
                                };
                            }
                        }
                        break;
                    case 'UNSET':
                        lastFrame.slots[slotToModify] = '';
                        break;
                    default:
                        break;
                }
            }
            else {
                switch (modifier.action) {
                    case 'ADD':
                        if (Array.isArray(lastFrame.slots[slotToModify].value)) {
                            lastFrame.slots[slotToModify].value.push(modifier.staticValue);
                            lastFrame.slots[slotToModify].original.push(modifier.staticValue);
                        }
                        else {
                            lastFrame.slots[slotToModify] = {
                                keyword: modifier.keyword,
                                value: lastFrame.slots[slotToModify].value ? [lastFrame.slots[slotToModify].value] : [],
                                original: lastFrame.slots[slotToModify].original ? [lastFrame.slots[slotToModify].original] : []
                            };
                            //Push the new recognized values to the list
                            lastFrame.slots[slotToModify].value.push(modifier.staticValue);
                            lastFrame.slots[slotToModify].original.push(modifier.staticValue);
                        }
                        break;
                    case 'REMOVE':
                        if (Array.isArray(lastFrame.slots[slotToModify].value)) {
                            lastFrame.slots[slotToModify].value = _.filter(lastFrame.slots[slotToModify].value, (value) => {

                                return value !== modifier.staticValue;
                            });
                            lastFrame.slots[slotToModify].original = _.filter(lastFrame.slots[slotToModify].original, (original) => {

                                return original !== modifier.staticValue;
                            });
                            if (lastFrame.slots[slotToModify].value.length === 0) {
                                lastFrame.slots[slotToModify] = '';
                            }
                        }
                        else {
                            if (lastFrame.slots[slotToModify].value === modifier.staticValue || lastFrame.slots[slotToModify].original === modifier.staticValue) {
                                lastFrame.slots[slotToModify] = '';
                            }
                        }
                        break;
                    case 'SET':
                        if (Array.isArray(lastFrame.slots[slotToModify].value)) {
                            lastFrame.slots[slotToModify] = {
                                keyword: modifier.keyword,
                                value: [],
                                original: []
                            };
                            lastFrame.slots[slotToModify].value.push(modifier.staticValue);
                            lastFrame.slots[slotToModify].original.push(modifier.staticValue);
                        }
                        else {
                            lastFrame.slots[slotToModify] = {
                                keyword: modifier.keyword,
                                value: modifier.staticValue,
                                original: modifier.staticValue
                            };
                        }
                        break;
                    case 'UNSET':
                        lastFrame.slots[slotToModify] = '';
                        break;
                    default:
                        break;
                }
            }
            if (lastFrame.slots[slotToModify].remainingLife > -1) {
                conversationStateObject.context.savedSlots[slotToModify] = lastFrame.slots[slotToModify];
            }
            agentService.converseFulfillEmptySlotsWithSavedValues({ conversationStateObject, requestId });
            const missingKeywords = _.filter(requiredSlots, (slot) => {

                if (currentFrame.slots[slot.slotName] && Array.isArray(currentFrame.slots[slot.slotName])) {
                    return currentFrame.slots[slot.slotName].length === 0;
                }
                return !currentFrame.slots[slot.slotName];
            });
            conversationStateObject.slots = currentFrame.slots;
            if (missingKeywords.length > 0) {
                const response = await agentService.converseCompileResponseTemplates({ responses: missingKeywords[0].textPrompts, templateContext: conversationStateObject, isTextPrompt: true, requestId });
                return response;
            }
        }
        else {
            const recognizedKeywordsNames = _.map(recognizedKeywords, (recognizedKeyword) => {
                //If the name of the recognized keyword match with an keyword name of an slot
                const slotToFill = _.filter(action.slots, (slot) => {
                    return slot.keyword === recognizedKeyword.keyword;
                })[0];
                if (slotToFill) {
                    //Get the slot object
                    //Get the slot name of the keyword that was recognized using the index of the array of keywords names
                    const slotName = slotToFill.slotName;
                    //If the slot is a list of elemnts
                    if (isListActionSlotName.indexOf(slotName) > -1) {
                        //If there isn't a value for this slot name in the context
                        if (!lastFrame.slots[slotName] || lastFrame.slots[slotName] === '') {
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text, requestId });
                            //Add these values to the context as a new slot
                            lastFrame.slots[slotName] = {
                                keyword: recognizedKeyword.keyword,
                                value: keywordValue.value,
                                original: keywordValue.original,
                                remainingLife: slotToFill.remainingLife
                            };
                        }
                        //If an slot in the context already exists for the recognized slot
                        else {
                            //If the value of the slot in the context is an array (This means that if the slot is a list)
                            if (Array.isArray(lastFrame.slots[slotName].value)) {
                                //If the slot haven't been overrided
                                if (overridedSlots.indexOf(slotName) === -1) {
                                    //Add the slot name to the list of overrided slots
                                    overridedSlots.push(slotName);
                                    //And clear the context of this slot
                                    lastFrame.slots[slotName] = {
                                        keyword: recognizedKeyword.keyword,
                                        value: [],
                                        original: [],
                                        remainingLife: slotToFill.remainingLife
                                    };
                                }
                                //Get the original and parsed value of the keyword
                                const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text, requestId });
                                //Push the recognized values to the current context slot value and original attribute
                                lastFrame.slots[slotName].value.push(keywordValue.value);
                                lastFrame.slots[slotName].original.push(keywordValue.original);
                            }
                            //If the slot ias a list, and it exists in the context but it wasn't an array
                            else {
                                //Get the original and parsed value of the keyword
                                const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text, requestId });
                                //Transform the current slot in the context to an array and insert the existent values in this array
                                lastFrame.slots[slotName] = {
                                    keyword: recognizedKeyword.keyword,
                                    value: [lastFrame.slots[slotName].value],
                                    original: [lastFrame.slots[slotName].original],
                                    remainingLife: slotToFill.remainingLife
                                };
                                //Push the new recognized values to the list
                                lastFrame.slots[slotName].value.push(keywordValue.value);
                                lastFrame.slots[slotName].original.push(keywordValue.original);
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

                            lastFrame.slots[slotName] = keywordService.parseSysValue({ keyword: allRecognizedKeywordsForRegex[0], text, requestId });
                            lastFrame.slots[slotName].remainingLife = slotToFill.remainingLife;
                        }
                        else {
                            lastFrame.slots[slotName] = keywordService.parseSysValue({ keyword: recognizedKeyword, text, requestId });
                            lastFrame.slots[slotName].remainingLife = slotToFill.remainingLife;

                        }

                    }
                    if (lastFrame.slots[slotName].remainingLife > -1) {
                        conversationStateObject.context.savedSlots[slotName] = lastFrame.slots[slotName];
                    }
                }
                //Finally return the name of the recognized keyword for further checks
                return recognizedKeyword.keyword;
            });
            agentService.converseFulfillEmptySlotsWithSavedValues({ conversationStateObject, requestId });
            const missingKeywords = _.filter(requiredSlots, (slot) => {

                return recognizedKeywordsNames.indexOf(slot.keyword) === -1 && !currentFrame.slots[slot.slotName];
            });
            conversationStateObject.slots = currentFrame.slots;
            if (missingKeywords.length > 0) {
                const response = await agentService.converseCompileResponseTemplates({ responses: missingKeywords[0].textPrompts, templateContext: conversationStateObject, isTextPrompt: true, requestId });
                return response;
            }
        }
    }
    if (action.useWebhook || agent.useWebhook) {
        let modelPath, webhook;
        if (action.useWebhook) {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: agent.id
                },
                {
                    model: MODEL_ACTION,
                    id: action.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true, requestId });
        }
        else {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: agent.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field, requestId });
        }
        const webhookResponse = await agentService.converseCallWebhook({
            url: webhook.webhookUrl,
            templatePayload: webhook.webhookPayload,
            payloadType: webhook.webhookPayloadType,
            method: webhook.webhookVerb,
            headers: webhook.webhookHeaders,
            username: webhook.webhookUser ? webhook.webhookUser : undefined,
            password: webhook.webhookPassword ? webhook.webhookPassword : undefined,
            templateContext: conversationStateObject
        });
        if (webhookResponse.textResponse) {
            return { slots: conversationStateObject.slots, textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], actionWasFulfilled: true, webhookResponse };
        }
        conversationStateObject.webhookResponse = { ...webhookResponse };
        const response = await agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject, requestId });
        return { slots: conversationStateObject.slots, ...response, webhookResponse, actionWasFulfilled: true };
    }
    const response = await agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject, requestId });
    return { slots: conversationStateObject.slots, ...response, actionWasFulfilled: true };
};
