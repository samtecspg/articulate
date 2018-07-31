'use strict';

const _ = require('lodash');

const RespondFulfilledSaying = require('./respondFulfilledSaying.agent.tool');
const PromptMissingKeyword = require('./promptMissingKeyword.agent.tool');
const GetKeywordValue = require('./getKeywordValue.agent.tool');

module.exports = (conversationStateObject, callback) => {

    //If there are slots in the scenario
    if (conversationStateObject.scenario.slots && conversationStateObject.scenario.slots.length > 0) {
        //Create an array of slot names
        const sayingSlotNames = _.map(conversationStateObject.scenario.slots, 'slotName');
        //Create an array of keyword names for each slot, with the same indexes than the previous array
        const sayingSlotKeywordsNames = _.map(conversationStateObject.scenario.slots, 'keyword');
        //Create an array of required slots (retrieve the full slot object)
        const requiredSlots = _.filter(conversationStateObject.scenario.slots, (slot) => {

            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slot.slotName] = conversationStateObject.currentContext.slots[slot.slotName] ? conversationStateObject.currentContext.slots[slot.slotName] : '';
            return slot.isRequired;
        });
        //Create an array of slot names fo slots that are lists
        const isListSlots = _.map(_.filter(conversationStateObject.scenario.slots, (slot) => {

            return slot.isList;
        }), 'slotName');
        //Extract the recognized keywords from the text parse
        //Create an array of slots that existed before and are being overrided because of a new text parse
        const recognizedKeywords = conversationStateObject.rasaResult.keywords;
        const overridedSlots = [];
        //Iterate over each recognized keyword
        const recognizedKeywordsNames = _.map(recognizedKeywords, (recognizedKeyword) => {

            //If the name of the recognized keyword match with an keyword name of an slot
            if (sayingSlotKeywordsNames.indexOf(recognizedKeyword.keyword) > -1) {
                //Get the slot name of the keyword that was recognized using the index of the array of keywords names
                const slotName = sayingSlotNames[sayingSlotKeywordsNames.indexOf(recognizedKeyword.keyword)];
                //If the slot is a list of elemnts
                if (isListSlots.indexOf(slotName) > -1) {
                    //If there isn't a value for this slot name in the context
                    if (!conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] || conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] === '') {
                        //Get the original and parsed value of the keyword
                        const keywordValue = GetKeywordValue(recognizedKeyword, conversationStateObject.text);
                        //Add these values to the context as a new slot
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                            value: keywordValue.value,
                            original: keywordValue.original
                        };
                    }
                    //If an slot in the context already exists for the recognized slot
                    else {
                        //If the value of the slot in the context is an array (This means that if the slot is a list)
                        if (Array.isArray(conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value)) {
                            //If the slot haven't been overrided
                            if (overridedSlots.indexOf(slotName) === -1) {
                                //Add the slot name to the list of overrided slots
                                overridedSlots.push(slotName);
                                //And clear the context of this slot
                                conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                                    value: [],
                                    original: []
                                };
                            }
                            //Get the original and parsed value of the keyword
                            const keywordValue = GetKeywordValue(recognizedKeyword, conversationStateObject.text);
                            //Push the recognized values to the current context slot value and original attribute
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value.push(keywordValue.value);
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original.push(keywordValue.original);
                        }
                        //If the slot ias a list, and it exists in the context but it wasn't an array
                        else {
                            //Get the original and parsed value of the keyword
                            const keywordValue = GetKeywordValue(recognizedKeyword, conversationStateObject.text);
                            //Transform the current slot in the context to an array and insert the existent values in this array
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = {
                                value: [conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value],
                                original: [conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original]
                            };
                            //Push the new recognized values to the list
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].value.push(keywordValue.value);
                            conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName].original.push(keywordValue.original);
                            overridedSlots.push(slotName);
                        }
                    }
                }
                //If slot is not a list
                else {
                    //Just insert an object with attributes value and original into the context slot after sorting the matching regex to keep the last one
                    if (recognizedKeyword.extractor === 'regex') {
                        const allRecognizedKeywordsForRegex = recognizedKeywords.filter((ent) => {

                            return ent.keyword === recognizedKeyword.keyword && ent.extractor === 'regex';

                        });
                        allRecognizedKeywordsForRegex.sort((a, b) => {

                            return b.end - a.end;
                        });
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = GetKeywordValue(allRecognizedKeywordsForRegex[0], conversationStateObject.text);
                    }
                    else {
                        conversationStateObject.context[conversationStateObject.context.length - 1].slots[slotName] = GetKeywordValue(recognizedKeyword, conversationStateObject.text);

                    }

                }
            }
            //If the slot wasn't part of the scenario slots array. This means that the slot is a system keyword
            else {
                //Check if it is a spacy or duckling system keyword
                if (recognizedKeyword.keyword.indexOf('sys.spacy_') !== -1 || recognizedKeyword.keyword.indexOf('sys.duckling_') !== -1 || recognizedKeyword.keyword.indexOf('sys.regex_') !== -1) {
                    //If there is a dictionary of slots in the current context, use this dictionary, if not, create an empty dictionary of slots
                    conversationStateObject.context[conversationStateObject.context.length - 1].slots = conversationStateObject.context[conversationStateObject.context.length - 1].slots ? conversationStateObject.context[conversationStateObject.context.length - 1].slots : {};
                    //If in the current dictionary of slots exists a dictionary for system keywords, use it, else create an empty dir for sys keywords
                    conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys = conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys ? conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys : {};
                    //Add the recognized system keywords to the dir of system keywords in the slots dir of the current context
                    conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys[recognizedKeyword.keyword.replace('sys.', '')] = GetKeywordValue(recognizedKeyword, conversationStateObject.text);
                }
            }
            //Finally return the name of the recognized keyword for further checks
            return recognizedKeyword.keyword;
        });
        const missingKeywords = _.filter(requiredSlots, (slot) => {

            return recognizedKeywordsNames.indexOf(slot.keyword) === -1 && !conversationStateObject.currentContext.slots[slot.slotName];
        });
        conversationStateObject.slots = conversationStateObject.currentContext.slots;
        if (missingKeywords.length > 0) {
            PromptMissingKeyword(conversationStateObject, missingKeywords[0], (err, response) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
        else {
            RespondFulfilledSaying(conversationStateObject, (err, response) => {

                if (err) {
                    return callback(err, null);
                }
                return callback(null, response);
            });
        }
    }
    else {
        conversationStateObject.slots = {};
        const recognizedKeywords = conversationStateObject.rasaResult.keywords;
        _.map(recognizedKeywords, (recognizedKeyword) => {

            if (recognizedKeyword.keyword.indexOf('sys.spacy_') !== -1 || recognizedKeyword.keyword.indexOf('sys.duckling_') !== -1) {
                conversationStateObject.context[conversationStateObject.context.length - 1].slots = conversationStateObject.context[conversationStateObject.context.length - 1].slots ? conversationStateObject.context[conversationStateObject.context.length - 1].slots : {};
                conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys = conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys ? conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys : {};
                conversationStateObject.context[conversationStateObject.context.length - 1].slots.sys[recognizedKeyword.keyword.replace('sys.', '')] = GetKeywordValue(recognizedKeyword, conversationStateObject.text);
            }
            return recognizedKeyword.keyword;
        });
        RespondFulfilledSaying(conversationStateObject, (err, response) => {

            if (err) {
                return callback(err, null);
            }
            return callback(null, response);
        });
    }
};
