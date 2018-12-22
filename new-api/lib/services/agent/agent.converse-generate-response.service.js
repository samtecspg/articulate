import _ from 'lodash';
import { CONFIG_KEYWORD_TYPE_REGEX, MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';

module.exports = async function ({ agent, action, context, currentContext, rasaResult, text }) {

    const { agentService, keywordService, globalService } = await this.server.services();
    //TODO: need to refactor the CSO creation since is no longer passed to other functions
    const conversationStateObject = { agent, action, context, currentContext, rasaResult, text };
    //TODO: remove context update, and move it somewhere else
    const lastFrame = context.frames[context.frames.length - 1];
    if (action.slots && action.slots.length > 0) {
        const actionSlotNames = _.map(action.slots, 'slotName');
        const actionSlotKeywordsNames = _.map(action.slots, 'keyword');
        const requiredSlots = _.filter(action.slots, (slot) => {

            lastFrame.slots[slot.slotName] = currentContext.slots[slot.slotName] ? currentContext.slots[slot.slotName] : '';
            return slot.isRequired;
        });
        const isListActionSlotName = _.map(_.filter(action.slots, (slot) => {

            return slot.isList;
        }), 'slotName');
        //Create an array of slots that existed before and are being overrided because of a new text parse
        const recognizedKeywords = rasaResult.keywords;
        const overridedSlots = [];
        const recognizedKeywordsNames = _.map(recognizedKeywords, (recognizedKeyword) => {
            //If the name of the recognized keyword match with an keyword name of an slot
            if (actionSlotKeywordsNames.indexOf(recognizedKeyword.keyword) > -1) {
                //Get the slot name of the keyword that was recognized using the index of the array of keywords names
                const slotName = actionSlotNames[actionSlotKeywordsNames.indexOf(recognizedKeyword.keyword)];
                //If the slot is a list of elemnts
                if (isListActionSlotName.indexOf(slotName) > -1) {
                    //If there isn't a value for this slot name in the context
                    if (!lastFrame.slots[slotName] || lastFrame.slots[slotName] === '') {
                        //Get the original and parsed value of the keyword
                        const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                        //Add these values to the context as a new slot
                        lastFrame.slots[slotName] = {
                            value: keywordValue.value,
                            original: keywordValue.original
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
                                    value: [],
                                    original: []
                                };
                            }
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                            //Push the recognized values to the current context slot value and original attribute
                            lastFrame.slots[slotName].value.push(keywordValue.value);
                            lastFrame.slots[slotName].original.push(keywordValue.original);
                        }
                        //If the slot ias a list, and it exists in the context but it wasn't an array
                        else {
                            //Get the original and parsed value of the keyword
                            const keywordValue = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                            //Transform the current slot in the context to an array and insert the existent values in this array
                            lastFrame.slots[slotName] = {
                                value: [lastFrame.slots[slotName].value],
                                original: [lastFrame.slots[slotName].original]
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

                        lastFrame.slots[slotName] = keywordService.parseSysValue({ keyword: allRecognizedKeywordsForRegex[0], text });
                    }
                    else {
                        lastFrame.slots[slotName] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });

                    }

                }
            }
            //If the slot wasn't part of the scenario slots array. This means that the slot is a system keyword
            //This block is commented to remove sys entities to be by default on slots
            /*else {
                //Check if it is a spacy or duckling system keyword
                if (recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_SPACY) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_DUCKLING) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_REGEX) !== -1) {
                    //If there is a dictionary of slots in the current context, use this dictionary, if not, create an empty dictionary of slots
                    lastFrame.slots = lastFrame.slots ? lastFrame.slots : {};
                    //If in the current dictionary of slots exists a dictionary for system keywords, use it, else create an empty dir for sys keywords
                    lastFrame.slots.sys = lastFrame.slots.sys ? lastFrame.slots.sys : {};
                    //Add the recognized system keywords to the dir of system keywords in the slots dir of the current context
                    lastFrame.slots.sys[recognizedKeyword.keyword.replace(KEYWORD_PREFIX_SYS, '')] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
                }
            }*/
            //Finally return the name of the recognized keyword for further checks
            return recognizedKeyword.keyword;
        });
        const missingKeywords = _.filter(requiredSlots, (slot) => {

            return recognizedKeywordsNames.indexOf(slot.keyword) === -1 && !currentContext.slots[slot.slotName];
        });
        conversationStateObject.slots = currentContext.slots;
        if (missingKeywords.length > 0) {
            const response = await agentService.converseCompileResponseTemplates({ responses: missingKeywords[0].textPrompts, templateContext: conversationStateObject, isTextPrompt: true });
            return response;
        }
    }
    else {
        //const recognizedKeywords = rasaResult.keywords;
        //This block is commented to remove sys entities to be by default on slots
        /*_.map(recognizedKeywords, (recognizedKeyword) => {

            if (recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_SPACY) !== -1 || recognizedKeyword.keyword.indexOf(KEYWORD_PREFIX_SYS_DUCKLING) !== -1) {
                lastFrame.slots = lastFrame.slots ? lastFrame.slots : {};
                lastFrame.slots.sys = lastFrame.slots.sys ? lastFrame.slots.sys : {};
                lastFrame.slots.sys[recognizedKeyword.keyword.replace(KEYWORD_PREFIX_SYS, '')] = keywordService.parseSysValue({ keyword: recognizedKeyword, text });
            }
            return recognizedKeyword.keyword;
        });*/
    }
    if (action.useWebhook || agent.useWebhook) {
        let webhook, modelPath;
        if (action.useWebhook){
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
                    model: MODEL_WEBHOOK,
                }
            ]
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true });
        }
        else {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: agent.id
                },
                {
                    model: MODEL_WEBHOOK,
                }
            ]
            webhook = await globalService.findInModelPath({ modelPath, isFindById, isSingleResult, skip, limit, direction, field });
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
            return { textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions: [] };
        }
        conversationStateObject.webhookResponse = { ...webhookResponse };
        const response = await agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject });
        return { ...response, actionWasFulfilled: true };
    }
    const response = await agentService.converseCompileResponseTemplates({ responses: conversationStateObject.action.responses, templateContext: conversationStateObject });
    return { ...response, actionWasFulfilled: true };
};
