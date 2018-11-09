import _ from 'lodash';
import {
    CONFIG_KEYWORD_TYPE_REGEX,
    KEYWORD_PREFIX_SYS,
    KEYWORD_PREFIX_SYS_DUCKLING,
    KEYWORD_PREFIX_SYS_REGEX,
    KEYWORD_PREFIX_SYS_SPACY
} from '../../../util/constants';

module.exports = async function ({ agent, action, context, currentContext, rasaResult, text }) {

    const { agentService, keywordService } = await this.server.services();
    let slots = null; //TODO: need to move this somewhere
    const conversationStateObject = null; //TODO: need to refactor the CSO creation since is no longer passed to other functions
    //TODO: remove context update, and move it somewhere else
    const lastContextIndex = context.length - 1;
    //MARK: action.slots > 0
    if (action.slots && action.slots.length > 0) {
        //MARK: Create an array of slot names
        const actionSlotNames = _.map(action.slots, 'slotName');
        //MARK: Create an array of keyword names for each slot, with the same indexes than the previous array
        const actionSlotKeywordsNames = _.map(action.slots, 'keyword');
        //MARK: Check if slot from action.slot exists in context slot and return it if they are required
        const requiredSlots = _.filter(action.slots, (slot) => {

            context[lastContextIndex].slots[slot.slotName] = currentContext.slots[slot.slotName] ? currentContext.slots[slot.slotName] : '';
            return slot.isRequired;
        });
        //MARK: create list if slots type list
        const isListActionSlotName = _.map(_.filter(action.slots, (slot) => {

            return slot.isList;
        }), 'slotName');
        //MARK: Extract the recognized keywords from the text parse
        //Create an array of slots that existed before and are being overrided because of a new text parse
        const recognizedKeywords = rasaResult.keywords;
        const overridedSlots = [];
        //MARK: Iterate over each recognized keyword
        const recognizedKeywordsNames = _.map(recognizedKeywords, (recognizedKeyword) => {
            //If the name of the recognized keyword match with an keyword name of an slot
            if (actionSlotKeywordsNames.indexOf(recognizedKeyword.keyword) > -1) {
                //Get the slot name of the keyword that was recognized using the index of the array of keywords names
                const slotName = actionSlotNames[actionSlotKeywordsNames.indexOf(recognizedKeyword.keyword)];
                //If the slot is a list of elemnts
                if (isListActionSlotName.indexOf(slotName) > -1) {
                    //If there isn't a value for this slot name in the context
                    if (!context[lastContextIndex].slots[slotName] || context[lastContextIndex].slots[slotName] === '') {
                        //Get the original and parsed value of the keyword
                        const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                        //Add these values to the context as a new slot
                        context[lastContextIndex].slots[slotName] = {
                            value: keywordValue.value,
                            original: keywordValue.original
                        };
                    }
                    //If an slot in the context already exists for the recognized slot
                    else {
                        //If the value of the slot in the context is an array (This means that if the slot is a list)
                        if (Array.isArray(context[lastContextIndex].slots[slotName].value)) {
                            //If the slot haven't been overrided
                            if (overridedSlots.indexOf(slotName) === -1) {
                                //Add the slot name to the list of overrided slots
                                overridedSlots.push(slotName);
                                //And clear the context of this slot
                                context[lastContextIndex].slots[slotName] = {
                                    value: [],
                                    original: []
                                };
                            }
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                            //Push the recognized values to the current context slot value and original attribute
                            context[lastContextIndex].slots[slotName].value.push(keywordValue.value);
                            context[lastContextIndex].slots[slotName].original.push(keywordValue.original);
                        }
                        //If the slot ias a list, and it exists in the context but it wasn't an array
                        else {
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                            //Transform the current slot in the context to an array and insert the existent values in this array
                            context[lastContextIndex].slots[slotName] = {
                                value: [context[lastContextIndex].slots[slotName].value],
                                original: [context[lastContextIndex].slots[slotName].original]
                            };
                            //Push the new recognized values to the list
                            context[lastContextIndex].slots[slotName].value.push(keywordValue.value);
                            context[lastContextIndex].slots[slotName].original.push(keywordValue.original);
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

                        context[lastContextIndex].slots[slotName] = keywordService.parseSysValue({ keyword: allRecognizedKeywordsForRegex[0], text });
                    }
                    else {
                        context[lastContextIndex].slots[slotName] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });

                    }

                }
            }
            //If the slot wasn't part of the scenario slots array. This means that the slot is a system keyword
            else {
                //Check if it is a spacy or duckling system keyword
                if (recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_SPACY) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_DUCKLING) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_REGEX) !== -1) {
                    //If there is a dictionary of slots in the current context, use this dictionary, if not, create an empty dictionary of slots
                    context[lastContextIndex].slots = context[lastContextIndex].slots ? context[lastContextIndex].slots : {};
                    //If in the current dictionary of slots exists a dictionary for system keywords, use it, else create an empty dir for sys keywords
                    context[lastContextIndex].slots.sys = context[lastContextIndex].slots.sys ? context[lastContextIndex].slots.sys : {};
                    //Add the recognized system keywords to the dir of system keywords in the slots dir of the current context
                    context[lastContextIndex].slots.sys[recognizedKeyword.keyword.replace(KEYWORD_PREFIX_SYS, '')] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                }
            }
            //Finally return the name of the recognized keyword for further checks
            return recognizedKeyword.keyword;
        });
        const missingKeywords = _.filter(requiredSlots, (slot) => {

            return recognizedKeywordsNames.indexOf(slot.keyword) === -1 && !currentContext.slots[slot.slotName];
        });
        slots = currentContext.slots;
        if (missingKeywords.length > 0) {
            return agentService.converseCompileResponseTemplates({ responses: missingKeywords[0].textPrompts, templateContext: conversationStateObject });
        }
    }
    //MARK: action.slots === 0
    else {
        slots = {};
        const recognizedKeywords = rasaResult.keywords;
        _.map(recognizedKeywords, (recognizedKeyword) => {

            if (recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_SPACY) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_DUCKLING) !== -1) {
                context[lastContextIndex].slots = context[lastContextIndex].slots ? context[lastContextIndex].slots : {};
                context[lastContextIndex].slots.sys = context[lastContextIndex].slots.sys ? context[lastContextIndex].slots.sys : {};
                context[lastContextIndex].slots.sys[recognizedKeyword.keyword.replace(KEYWORD_PREFIX_SYS, '')] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
            }
            return recognizedKeyword.keyword;
        });
    }
    if (action.useWebhook || agent.useWebhook) {
        const webhook = action.useWebhook ? action.webhook : agent.webhook;
        const webhookResponse = await agentService.converseCallWebhook({
            url: webhook.webhookUrl,
            templatePayload: webhook.webhookPayload,
            payloadType: webhook.webhookPayloadType,
            method: webhook.webhookVerb,
            templateContext: conversationStateObject
        });
        if (webhookResponse.textResponse) {
            return webhookResponse.textResponse;
        }
        const textResponse = agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject });
        return { ...webhookResponse, ...{ textResponse } };
    }
    return agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject });
};
