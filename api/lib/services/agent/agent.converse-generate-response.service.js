import _ from 'lodash';
import { MODEL_AGENT, MODEL_ACTION, MODEL_WEBHOOK } from '../../../util/constants';
const { VM, VMScript } = require('vm2');

module.exports = async function ({ actionData, CSO }) {

    const { agentService, globalService } = await this.server.services();
    const previousListenState = CSO.context.listenFreeText === true;

    //This will initialize the slots in the current action and also will return the required slots of the action
    const requiredSlots = _.filter(actionData.slots, (slot) => {

        return slot.isRequired;
    });
    const missingSlots = _.filter(requiredSlots, (slot) => {

        if (CSO.currentAction.slots[slot.slotName] && Array.isArray(CSO.currentAction.slots[slot.slotName])) {
            return CSO.currentAction.slots[slot.slotName].length === 0;
        }
        return (CSO.currentAction.slots[slot.slotName].value !== undefined && !CSO.currentAction.slots[slot.slotName].value)
            || (CSO.currentAction.slots[slot.slotName].value === undefined && !CSO.currentAction.slots[slot.slotName].from && !CSO.currentAction.slots[slot.slotName].to);
    });
    CSO.slots = CSO.currentAction.slots;
    if (missingSlots.length > 0) {
        let missingSlotIndex = null;
        missingSlots.some((missingSlot, tempMissingSlotIndex) => {

            CSO.currentAction.slots[missingSlot.slotName].promptCount += 1;
            if (missingSlot.promptCountLimit === undefined || missingSlot.promptCountLimit === null || missingSlot.promptCountLimit >= CSO.currentAction.slots[missingSlot.slotName].promptCount) {
                if (missingSlots[tempMissingSlotIndex].freeText) {
                    if (CSO.context.listenFreeText) {
                        Object.assign(CSO.currentAction.slots[missingSlots[tempMissingSlotIndex].slotName], {
                            value: CSO.text,
                            original: CSO.text,
                        });
                        CSO.context.listenFreeText = false;
                        return false;
                    }
                    else {
                        CSO.context.listenFreeText = true;
                    }
                }
                missingSlotIndex = tempMissingSlotIndex;
                return true;
            }
            return false;
        });
        if (missingSlotIndex !== null) {
            const missingSlot = missingSlots[missingSlotIndex];
            const response = await agentService.converseCompileResponseTemplates({ responses: missingSlot.textPrompts, templateContext: CSO, isTextPrompt: true, promptCount: CSO.currentAction.slots[missingSlot.slotName].promptCount });
            var missingSlotQuickResponses = CSO.agent.settings.generateSlotsQuickResponses?
                await agentService.converseGenerateAutomaticMissingSlotQuickResponses({CSO, missingSlot}) :
                missingSlots[0].quickResponses
            return { ...response, quickResponses: missingSlotQuickResponses, fulfilled: false };
        }
        if (!previousListenState && !CSO.context.listenFreeText) {
            return { slotPromptLimitReached: true }
        }
    }

    if (actionData.useWebhook || CSO.agent.useWebhook) {
        let modelPath, webhook;
        if (actionData.useWebhook) {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_ACTION,
                    id: actionData.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
            webhook = await globalService.findInModelPath({ modelPath, isFindById: false, isSingleResult: true });
        }
        else {
            modelPath = [
                {
                    model: MODEL_AGENT,
                    id: CSO.agent.id
                },
                {
                    model: MODEL_WEBHOOK
                }
            ];
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
            templateContext: CSO
        });
        CSO.webhook = {
            [webhook.webhookKey]: { ...webhookResponse }
        };
        if (webhook.postScript) {
            const vm = new VM({
                timeout: 1000,
                sandbox: {
                    CSO
                }
            });

            const script = new VMScript(webhook.postScript);
            try {
                CSO = vm.run(script);
            } catch (err) {
                console.error(`Failed to execute postScript of the webhook ${webhook.webhookKey}`, err);
            }
        }
        if (webhookResponse.textResponse) {
            return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, textResponse: webhookResponse.textResponse, actions: webhookResponse.actions ? webhookResponse.actions : [], fulfilled: true, webhook: { [webhook.webhookKey]: webhookResponse } };
        }
        const quickResponses = await agentService.converseCompileQuickResponsesTemplates({ quickResponses: actionData.responsesQuickResponses, templateContext: CSO });
        const response = await agentService.converseCompileResponseTemplates({ responses: actionData.responses, templateContext: CSO });
        return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, ...response, quickResponses: quickResponses, webhook: { [webhook.webhookKey]: webhookResponse }, fulfilled: true };
    }
    const quickResponses = await agentService.converseCompileQuickResponsesTemplates({ quickResponses: actionData.responsesQuickResponses, templateContext: CSO });
    const response = await agentService.converseCompileResponseTemplates({ responses: actionData.responses, templateContext: CSO });
    return { slots: CSO.context.actionQueue[CSO.actionIndex].slots, ...response, quickResponses: quickResponses, fulfilled: true };
};
